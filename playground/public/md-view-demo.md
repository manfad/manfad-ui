# MdView

Render Markdown as part of your application while keeping the source readable
and reviewable in Git.

## What it supports

- Headings, paragraphs, lists, links, tables, and blockquotes
- Fenced code blocks and inline `code`
- Runtime files through the `src` prop
- Bundled repository files through `content`

> Raw HTML is disabled by default, which is the right default for documentation.

```ts
import guide from './guide.md?raw'
```

| Input | Recommended use |
| --- | --- |
| `src` | Public or API-served Markdown |
| `content` | Markdown bundled with the application |
