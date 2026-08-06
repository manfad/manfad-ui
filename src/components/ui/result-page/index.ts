import type { ErrorPageVariant } from './ErrorPage.vue'
import type { FunctionalComponent } from 'vue'
import { h } from 'vue'
import ErrorPage from './ErrorPage.vue'

export { default as ErrorPage } from './ErrorPage.vue'
export type { ErrorPageProps, ErrorPageTone, ErrorPageVariant } from './ErrorPage.vue'
/** @deprecated Use `ErrorPageProps` / `ErrorPageTone` instead. */
export type { ErrorPageProps as ResultPageProps, ErrorPageTone as ResultPageTone } from './ErrorPage.vue'

/**
 * Backwards-compatible aliases. Prefer `<ErrorPage variant="…" />` directly.
 */

function variantAlias(variant: ErrorPageVariant): FunctionalComponent {
  return (props, { slots }) => h(ErrorPage, { ...props, variant }, slots)
}

/** @deprecated Use `<ErrorPage variant="unauthorized" />` instead. */
export const UnauthorizedPage = variantAlias('unauthorized')

/** @deprecated Use `<ErrorPage variant="no-permission" />` instead. */
export const NoPermissionPage = variantAlias('no-permission')

/** @deprecated Use `<ErrorPage variant="custom" />` instead. */
export const ResultPage = variantAlias('custom')
