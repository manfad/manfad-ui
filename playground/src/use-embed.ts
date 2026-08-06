import { computed } from 'vue'
import { useRoute } from 'vue-router'

/** True when the page is loaded inside a showcase iframe (`?embed=1`). */
export function useEmbed() {
  const route = useRoute()
  return computed(() => route.query.embed === '1')
}
