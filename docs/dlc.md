# Optional DLCs

> Heavy surfaces ship as subpath add-ons. Import them from their export and install the peer only when you use that surface.

| DLC | Import | Install |
| --- | --- | --- |
| Charts | `@manfad99/ui/chart` | `pnpm add @unovis/ts@1.6.7 @unovis/vue@1.6.7` |
| TimeBadge | `@manfad99/ui/time-badge` | `pnpm add @vueuse/core` |
| MdView | `@manfad99/ui/md-view` | `pnpm add markdown-it` |
| Excel | `@manfad99/ui/excel` | `pnpm add xlsx` |

```ts
import { LineChart } from '@manfad99/ui/chart'
import { TimeBadge } from '@manfad99/ui/time-badge'
import { MdView } from '@manfad99/ui/md-view'
import { Excel, ExcelExport, ExcelImport } from '@manfad99/ui/excel'
```

The core `@manfad99/ui` barrel does not re-export these modules.

## Charts notes

1. `presetManfadUi()` is required — it includes the rule that lets Unovis fill the height set by `ChartContainer`.
2. Keep `@unovis/vue` and `@unovis/ts` on matching exact versions (`1.6.7`).
3. If you widen UnoCSS `content.pipeline.include` to plain `.ts`/`.js`, exclude `node_modules` so Unovis template-string CSS is not scanned.

## Excel notes

- Import **replaces** `rows`.
- Headers match column **label**, then **key** (normalized).
- Default cell type is `string` (keeps MY phone leading zeros); opt into `type: 'number'`.
- Export writes string columns as Excel text (`@` format).
