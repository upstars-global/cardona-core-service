// import { ref } from 'vue'
// import type { VerticalNavItems } from '@layouts/types'
//
// export function useAppsAndPages() {
//   const appsAndPages = ref<VerticalNavItems>([
//     {
//       title: 'page.demo._',
//       icon: { icon: 'tabler-box' },
//       to: { name: 'DemoList' },
//     },
//     {
//       title: 'page.groupFragment.demoPage',
//       to: { name: 'PermissionPage', params: { id: 'demo' } },
//       icon: { icon: 'tabler-box' },
//     },
//     {
//       title: 'Constructor',
//       to: { name: 'Constructor' },
//       icon: { icon: 'tabler-box' },
//     },
//   ])
//
//   return { appsAndPages }
// }
import type { VerticalNavItems } from '@layouts/types'

export default [
  {
    title: 'page.demo._',
    icon: { icon: 'tabler-box' },
    to: { name: 'DemoList' },
  },
  {
    title: 'page.groupFragment.demoPage',
    to: { name: 'PermissionPage', params: { id: 'demo' } },
    icon: { icon: 'tabler-box' },
  },
  {
    title: 'Constructor',
    to: { name: 'Constructor' },
    icon: { icon: 'tabler-box' },
  },
] as VerticalNavItems
