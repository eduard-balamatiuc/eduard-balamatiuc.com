import { visit } from 'unist-util-visit';

/**
 * Rehype plugin that enhances code blocks with:
 * - A wrapper div for positioning context
 * - A header bar showing the language name
 * - A copy-to-clipboard button
 *
 * Transforms: <pre data-language="js"><code>...</code></pre>
 * Into:
 *   <div class="code-block-wrapper">
 *     <div class="code-block-header">
 *       <span class="code-block-lang">js</span>
 *       <button class="code-copy-btn" aria-label="Copy code">Copy</button>
 *     </div>
 *     <pre data-language="js"><code>...</code></pre>
 *   </div>
 */
export default function rehypeCodeBlocks() {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index == null) return;
      if (node.tagName !== 'pre') return;

      const codeEl = node.children?.find(
        (c) => c.type === 'element' && c.tagName === 'code'
      );
      if (!codeEl) return;

      // Extract language from data-language on <pre> (Shiki/Astro convention)
      // or from class="language-xxx" on <code> (standard markdown convention)
      let lang = node.properties?.dataLanguage || '';
      if (!lang) {
        const classes = codeEl.properties?.className || [];
        const langClass = classes.find((cls) =>
          typeof cls === 'string' && cls.startsWith('language-')
        );
        lang = langClass ? langClass.replace('language-', '') : '';
      }

      // Build the header children
      const headerChildren = [];
      const displayLang = lang && lang !== 'plaintext' ? lang : '';

      if (displayLang) {
        headerChildren.push({
          type: 'element',
          tagName: 'span',
          properties: { className: ['code-block-lang'] },
          children: [{ type: 'text', value: displayLang }],
        });
      }

      headerChildren.push({
        type: 'element',
        tagName: 'button',
        properties: {
          className: ['code-copy-btn'],
          ariaLabel: 'Copy code',
          type: 'button',
        },
        children: [{ type: 'text', value: 'Copy' }],
      });

      const header = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block-header'] },
        children: headerChildren,
      };

      // Wrap the original <pre> in a container div
      const wrapper = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block-wrapper'] },
        children: [header, node],
      };

      // Replace the <pre> with the wrapper in the parent
      parent.children[index] = wrapper;
    });
  };
}
