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
  {
    title: 'Component Library',
    href: '/storybook/index.html',
    target: '_blank',
    icon: { icon: 'tabler-book' },
  },
] as VerticalNavItems
