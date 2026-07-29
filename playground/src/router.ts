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
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/buttons' },
    ...componentSections.map(section => ({
      path: `/${section.id}`,
      name: section.id,
      component: pageLoader(section.id),
      meta: { title: section.label },
    })),
    { path: '/:pathMatch(.*)*', redirect: '/buttons' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})
