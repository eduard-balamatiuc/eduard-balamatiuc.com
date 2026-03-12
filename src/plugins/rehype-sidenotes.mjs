import { visit } from 'unist-util-visit';

export default function rehypeSidenotes() {
  return (tree) => {
    // Step 1: Find the footnotes section
    let footnotesSection = null;

    visit(tree, 'element', (node) => {
      if (node.tagName === 'section' && node.properties?.dataFootnotes != null) {
        footnotesSection = node;
      }
    });

    if (!footnotesSection) return;

    // Find the <ol> inside the footnotes section
    const ol = footnotesSection.children.find(
      (c) => c.type === 'element' && c.tagName === 'ol'
    );
    if (!ol) return;

    // Step 2: Build a map from footnote ID to content
    const footnoteMap = new Map();

    for (const li of ol.children) {
      if (li.type !== 'element' || li.tagName !== 'li') continue;
      const id = li.properties?.id;
      if (!id) continue;

      // Deep clone children and strip backref links
      const content = JSON.parse(JSON.stringify(li.children));
      removeBackrefs(content);
      convertParagraphsToSpans(content);

      footnoteMap.set(id, content);
    }

    // Step 3: Find all <sup> footnote refs and collect insertion points
    const insertions = [];
    let counter = 0;

    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName !== 'sup') return;

      const refLink = node.children?.find(
        (c) =>
          c.type === 'element' &&
          c.tagName === 'a' &&
          c.properties?.dataFootnoteRef != null
      );
      if (!refLink) return;

      const href = refLink.properties?.href;
      if (!href) return;

      const fnId = href.replace('#', '');
      const content = footnoteMap.get(fnId);
      if (!content) return;

      counter++;
      insertions.push({ parent, index, counter, content, fnId });
    });

    // Apply insertions in reverse order to preserve indices
    for (let i = insertions.length - 1; i >= 0; i--) {
      const { parent, index, counter, content, fnId } = insertions[i];

      const sidenote = {
        type: 'element',
        tagName: 'span',
        properties: {
          className: ['sidenote'],
          dataFootnoteId: fnId,
        },
        children: [
          {
            type: 'element',
            tagName: 'span',
            properties: { className: ['sidenote-number'] },
            children: [{ type: 'text', value: String(counter) }],
          },
          { type: 'text', value: ' ' },
          ...content,
        ],
      };

      parent.children.splice(index + 1, 0, sidenote);
    }

    // Step 4: Add fallback class to footnotes section
    if (!footnotesSection.properties.className) {
      footnotesSection.properties.className = [];
    }
    if (!Array.isArray(footnotesSection.properties.className)) {
      footnotesSection.properties.className = [
        footnotesSection.properties.className,
      ];
    }
    footnotesSection.properties.className.push('sidenote-fallback-section');
  };
}

/** Remove data-footnote-backref links from cloned footnote content */
function removeBackrefs(nodes) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    if (
      node.type === 'element' &&
      node.tagName === 'a' &&
      node.properties?.dataFootnoteBackref != null
    ) {
      nodes.splice(i, 1);
      continue;
    }
    if (node.children) {
      removeBackrefs(node.children);
    }
  }
}

/** Convert <p> to <span> inside sidenote content to avoid invalid nesting */
function convertParagraphsToSpans(nodes) {
  for (const node of nodes) {
    if (node.type === 'element' && node.tagName === 'p') {
      node.tagName = 'span';
      if (!node.properties.className) {
        node.properties.className = [];
      }
      node.properties.className.push('sidenote-p');
    }
    if (node.children) {
      convertParagraphsToSpans(node.children);
    }
  }
}
