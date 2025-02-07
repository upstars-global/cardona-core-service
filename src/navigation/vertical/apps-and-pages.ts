import type { VerticalNavItems } from '@layouts/types'

const navItems = [
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
] as VerticalNavItems

export default navItems
