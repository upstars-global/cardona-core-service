import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { setStorage } from '../helpers/storage'
import { storageKeys } from '../configs/storage'
import type { ProjectInfoInput } from '@/@model/project'

export const useChangeProject = () => {
  const store = useStore()
  const route = useRoute()
  const router = useRouter()

  const selectedProject = computed(() => store.getters.selectedProject)

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

  const changeProject = async (project: ProjectInfoInput, withoutNavigation: boolean) => {
    setStorage(storageKeys.selectedProjectId, project.id)
    await store.dispatch('setSelectedProject', project)

    if (!withoutNavigation)
      await navigationOnProjectChanges(project)
  }

  return { changeProject }
}
