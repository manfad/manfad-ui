# LLMs.txt

> How to get AI tools like Cursor, Windsurf, GitHub Copilot, ChatGPT, and Claude to understand `@manfad/ui` components, theming, and best practices.

## What is LLMs.txt?

LLMs.txt is a structured documentation format designed for large language models. `@manfad/ui` provides LLMs.txt files with an index of components, setup guidance, and DLC notes so assistants can import the right package paths and follow kit conventions.

## Available files

- [`/llms.txt`](https://raw.githubusercontent.com/manfad/manfad-ui/main/llms.txt) — Structured overview of getting started docs and every component (~token-light index).
- [`/llms-full.txt`](https://raw.githubusercontent.com/manfad/manfad-ui/main/llms-full.txt) — Comprehensive install, theming, DLC, and usage patterns in one file.

When the component playground is running (`pnpm dev`), the same files are also served from the site root:

- http://127.0.0.1:5173/llms.txt
- http://127.0.0.1:5173/llms-full.txt

## Choosing the right file

Most users should start with **llms.txt** — it lists essentials and works with standard context windows. Use **llms-full.txt** when you need install snippets, theming, and DLC examples in one shot and your tool supports larger contexts.

## Important usage notes

When using tools like Cursor or Windsurf, the `@` symbol for doc references must be typed by hand in the chat interface. Copy-pasting can break the tool's ability to recognize it as a context reference.

## Usage with AI tools

### Cursor

1. Direct reference: paste the LLMs.txt URL when asking questions about `@manfad/ui`.
2. Add the URLs to project docs context with `@Docs` (type `@` yourself).

Suggested docs entries:

- `https://raw.githubusercontent.com/manfad/manfad-ui/main/llms.txt`
- `https://raw.githubusercontent.com/manfad/manfad-ui/main/llms-full.txt`
- `https://raw.githubusercontent.com/manfad/manfad-ui/main/README.md`

### Windsurf

- Use `@docs` to reference the LLMs.txt URLs.
- Optionally add persistent workspace rules pointing at `llms.txt`.

### ChatGPT, Claude, and others

- "Using @manfad/ui documentation from https://raw.githubusercontent.com/manfad/manfad-ui/main/llms.txt"
- "Follow complete @manfad/ui guidelines from https://raw.githubusercontent.com/manfad/manfad-ui/main/llms-full.txt"

## Related

- [Getting started](../../getting-started.md)
- [Theming](../../theming.md)
- [Optional DLCs](../../dlc.md)
- [README](../../../README.md)
