---
layout: ../../layouts/MarkdownDispatchLayout.astro
title: 'Kitchen Sink'
date: '2025-01-01'
description: 'A comprehensive test article exercising every markdown and content feature for visual verification.'
image: '/letter-e.png'
hidden: true
---

## Headings

The h2 above should be pink[^1]. Below are h3–h6:

### Heading Level 3

This should be purple.

#### Heading Level 4

##### Heading Level 5

###### Heading Level 6

---

## Text Formatting

This is a paragraph with **bold text** (should be orange), *italic text*, ***bold and italic combined***, and ~~strikethrough text~~[^2].

Here is a second paragraph to verify spacing between paragraphs. It contains a mix of normal text with **bold** and *italic* inline.

---

## Links

- External link: [Astro Documentation](https://docs.astro.build/) — should be cyan with underline
- Internal link: [Home](/) — same styling

A link in a sentence: visit [knowledge.eduard-balamatiuc.com](https://knowledge.eduard-balamatiuc.com/) for more.

---

## Code

Inline code: `const x = 42;` — should be green[^3].

Fenced JavaScript block (Shiki monokai):

```js
function greet(name) {
  const message = `Hello, ${name}!`;
  console.log(message);
  return message;
}

// Call the function
greet("World");
```

Fenced plain block (no language):

```
This is a plain code block.
No syntax highlighting here.
Just monospace text.
```

---

## Blockquotes

Simple blockquote:

> This is a blockquote. It should have distinct styling from regular paragraphs.

Nested blockquote[^4]:

> This is the outer blockquote.
>
> > This is a nested blockquote inside the outer one.
>
> Back to the outer level.

Blockquote with inline formatting:

> **Bold inside a quote**, *italic inside a quote*, and `code inside a quote`.

---

## Lists

Unordered list:

- First item
- Second item
- Third item

Ordered list:

1. First item
2. Second item
3. Third item

Nested list[^5]:

- Top level A
  - Nested A1
  - Nested A2
    - Deep nested A2a
- Top level B
  1. Ordered nested B1
  2. Ordered nested B2

---

## Horizontal Rules

There should be horizontal rules separating each major section. Here are two more close together:

---

---

Check that spacing above and below is consistent.

---

## Images

Below is an image — verify layout reflow and that sidenotes reposition correctly around it[^6]:

![Letter E logo](/letter-e.png)

Text continues after the image to verify reflow.

---

## Tables

| Feature       | Status  | Notes                  |
|---------------|---------|------------------------|
| Bold          | Working | Renders orange         |
| Italic        | Working | Standard italic        |
| Code          | Working | Green inline           |
| Links         | Working | Cyan with underline    |
| Sidenotes     | Working | Scroll-reveal enabled  |

A paragraph after the table to check spacing[^7].

---

## Sidenotes Stress Test

Here are three footnotes placed close together[^8] to test overlap prevention[^9] when sidenotes stack vertically[^10].

After a gap of text — this paragraph exists to create vertical distance between the cluster above and the next footnote. The sidenote for this one should align cleanly without being pushed down by the previous cluster.

---

## Combined Elements

Blockquote containing a list:

> Things to verify:
>
> - Heading colors
> - Inline formatting
> - Code blocks
> - Sidenote positioning

A paragraph with every inline element: **bold**, *italic*, ***bold italic***, ~~strikethrough~~, `inline code`, and a [link](/)[^11].

---

## Theme Testing

Toggle between dark and light themes and re-check every section above[^12]. Pay attention to:

- Heading colors remain visible and distinct
- Code block backgrounds contrast correctly
- Link colors are readable
- Sidenote styling adapts to theme
- Table borders and alternating rows (if any) render in both themes

[^1]: Headings use Monokai Pro colors — h2 is `--mono-pink`, h3 is `--mono-purple`.
[^2]: Bold text uses `--mono-orange`. Strikethrough and italic use default text color.
[^3]: Inline code uses `--mono-green` on a `--mono-surface` background.
[^4]: Blockquotes have a yellow left border (`--mono-yellow`) and surface background.
[^5]: Lists should maintain consistent indentation and spacing at all nesting levels.
[^6]: Images may cause layout reflow — sidenotes should reposition correctly when an image loads.
[^7]: Tables use GFM (GitHub Flavored Markdown) syntax. Check border rendering in both themes.
[^8]: First clustered sidenote — tests initial placement.
[^9]: Second clustered sidenote — tests overlap prevention with the first.
[^10]: Third clustered sidenote — tests stacking when three are close together.
[^11]: This sidenote tests a reference after mixed inline formatting in the same paragraph.
[^12]: Theme toggle should not cause sidenotes to jump or lose their reveal state.
