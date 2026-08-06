import { createRouter, createWebHistory } from 'vue-router'
import { componentSections } from './sections'

const pageModules = import.meta.glob('./pages/*Page.vue')

function pageLoader(id: string) {
  const pascal = id.split('-').map(p => p[0].toUpperCase() + p.slice(1)).join('')
  const key = `./pages/${pascal}Page.vue`
  const loader = pageModules[key]
  if (!loader)
    throw new Error(`Missing playground page for ${id} (${key})`)
  return loader
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/docs' },
    {
      path: '/docs',
      name: 'docs',
      component: () => import('./pages/DocsPage.vue'),
      meta: { title: 'Home', wide: true, mode: 'docs' },
    },
    {
      path: '/docs/llms-txt',
      name: 'llms-txt',
      component: () => import('./pages/LlmsTxtPage.vue'),
      meta: { title: 'LLMs.txt', wide: true, mode: 'docs' },
    },
    ...componentSections.map(section => ({
      path: `/${section.id}`,
      name: section.id,
      component: pageLoader(section.id),
      meta: { title: section.label, wide: section.wide },
    })),
    { path: '/:pathMatch(.*)*', redirect: '/docs' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
