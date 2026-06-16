import { ref } from 'vue'

export function useAppsAndPages() {
  return {
    appsAndPages: ref([
      {
        title: 'page.demo._',
        icon: { icon: 'tabler-box' },
        to: { name: 'DemoList' },
      },
      {
        title: 'page.groupFragment.demoPage',
        to: { name: 'PermissionPage', params: { id: 'demo' } },
        icon: { icon: 'tabler-lock-access' },
      },
      {
        title: 'Constructor',
        to: { name: 'Constructor' },
        icon: { icon: 'tabler-brand-databricks' },
      },

    ]),
  }
}
