import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { storageKeys } from '../configs/storage'
import type { ProjectInfoInput } from '../@model/project'
import { useUserStore } from '../stores/user'

export const useChangeProject = () => {
  const store = useStore()
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()

  const navigationOnProjectChanges = (project: ProjectInfoInput) => {
    const featureRoot = route?.meta?.breadcrumb?.[0]?.to?.name

    if (route?.params?.id && featureRoot) {
      return router.push({
        name: featureRoot,
        params: { ...route.params, project: project.alias },
        query: { ...route.query },
      })
    }

    return router.push({
      params: { ...route.params, project: project.alias },
      query: { ...route.query },
    })
  }

  const changeProject = async (project: ProjectInfoInput, withoutNavigation?: boolean) => {

    sessionStorage.setItem(storageKeys.selectedProjectId, project.id)
    await store.dispatch('setSelectedProject', project)
    userStore.setSelectedProject(project)
    if (!withoutNavigation)
      await navigationOnProjectChanges(project)
  }

  return { changeProject }
}
