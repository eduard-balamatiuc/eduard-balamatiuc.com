# eduard-balamatiuc.com
My sharing place, just check it [here](https://eduard-balamatiuc.com/).

## Adding a new dispatch

1. Create a new `.md` file in `src/pages/dispatches/` (e.g., `my-new-post.md`)
2. Add this frontmatter at the top:

```yaml
---
layout: ../../layouts/MarkdownDispatchLayout.astro
title: "Your Title"
date: '2026-03-29'
time: '22:40'
description: "Short summary for homepage and meta tags"
image: "/letter-e.png"
---
```

3. Write your content below the frontmatter using markdown

**Optional frontmatter fields:**
- `time: "10:00"` — used for sorting when two dispatches share the same date
- `hidden: true` — hides the dispatch from the homepage

**Optional steps:**
- To star a dispatch, add its title to `src/data/starred-dispatches.ts`

**Notes:**
- The URL is generated from the title, not the filename
- Sidenotes use standard footnote syntax: `[^1]` inline and `[^1]: text` at the bottom

## Running the project

```bash
pnpm install    
pnpm build  
pnpm preview    
```

Before pushing, run `pnpm build` to catch any errors.