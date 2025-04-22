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

    if (route?.params?.id && featureRoot)
      return router.push({ name: featureRoot, params: { ...route.params, project: project.alias } })

    return router.push({ params: { ...route.params, project: project.alias } })
  }

  const changeProject = async (project: ProjectInfoInput) => {
    const isSameProject: boolean = selectedProject.value?.id === project.id

    setStorage(storageKeys.selectedProjectId, project.id)

    if (!isSameProject) {
      await navigationOnProjectChanges(project)
      await store.dispatch('setSelectedProject', project)
    }
  }

  return { changeProject }
}
