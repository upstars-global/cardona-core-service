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

  const changeProject = (project: ProjectInfoInput) => {
    const isSameProject: boolean = selectedProject.value?.id === project.id

    setStorage(storageKeys.selectedProjectId, project.id)

    if (!isSameProject)
      router.push({ params: { ...route.params, project: project.alias } })

    store.dispatch('setSelectedProject', project)
  }

  return { changeProject }
}
