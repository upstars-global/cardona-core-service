import { defineStore } from 'pinia'
import ApiService from '../services/api'
import type { OptionsItem } from '../@model'
import { ListData } from '../@model'
import { useAppConfigCoreStore } from './appConfigCore'
import { ProjectInfo } from '../@model/project'
import { productId } from '@productConfig'

export type ProjectOptionItem = OptionsItem & { alias: string }

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projectOptions: [] as ProjectOptionItem[]
  }),
  getters: {
    getProjectOptions(state) {
      return state.projectOptions
    },
  },
  actions: {
    async fetchProjectsList(inputData?: { data?: any } | any) {
      const data = (inputData as any)?.data ? (inputData as any).data : inputData

      const response = await ApiService.request({
        type: 'App.V2.Projects.List',
        pagination: {
          pageNumber: data?.page ?? 1,
          perPage: data?.perPage ?? 20,
        },
        filter: {
          productIds: [productId],
          ...(data?.filter || {}),
        },
      })

      return new ListData<ProjectInfo>(response, ProjectInfo)
    },
    async fetchProjectWithCache(inputData?: { data?: any } | any) {
      const data = (inputData as any)?.data ? (inputData as any).data : inputData

      const response = await ApiService.request({
        type: 'App.V2.Projects.List',
        pagination: {
          pageNumber: data?.page ?? 1,
          perPage: data?.perPage ?? 20,
        },
        filter: {
          productIds: [productId],
          ...(data?.filter || {}),
        },
      })

      this.projectOptions = response?.data?.map((item: ProjectInfo) => ({
        name: item.name,
        id: item.id,
        alias: item.alias
      }))

      return new ListData<ProjectInfo>(response, ProjectInfo)
    },
    fetchVerifiedProjectsList() {
      return new ListData<ProjectInfo>({ data: useAppConfigCoreStore().verifiedProjects }, ProjectInfo)
    },
  },
})
