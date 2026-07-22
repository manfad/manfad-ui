<img src="playground/public/icon.png" alt="yf-ui" width="96" />

# @yf/ui

Reusable Vue 3 admin UI kit (shadcn-style components on UnoCSS).

## Usage in the template

The monorepo template consumes this package via the root pnpm workspace:

```json
"@yf/ui": "workspace:*"
```

Install and build from the repository root:

```bash
cd ..
pnpm install
pnpm --filter @yf/ui build
```

## Standalone development

```bash
pnpm install
pnpm dev        # playground
pnpm build      # library dist/
pnpm typecheck
```

## Exports

- `@yf/ui` — components, composables, utilities
- `@yf/ui/preset` — UnoCSS preset for consumer apps
