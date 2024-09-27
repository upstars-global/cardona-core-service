import { vi } from 'vitest'
import ApiService from '../../services/api'
import { transformNameToType } from './baseStoreCore'
import { ApiTypePrefix } from '@productConfig'

vi.mock('../../services/api', () => ({
  request: vi.fn(),
}))

export const createMockedStore = ({ canUpdate = true, userInfo = null } = {}) => {
  return {
    namespaced: true,

    actions: {
      async readEntity(_, payload) {
        ApiService.request.mockResolvedValue({
          data: { id: payload.id, type: payload.type, name: 'Mocked Entity' },
        })

        const { data } = await ApiService.request({
          type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
            payload.type,
          )}.Read`,
          data: {
            id: payload.id,
          },
        })

        return data
      },

      async updateEntity({ commit, rootGetters }, payload) {
        const user = {
          ...rootGetters.userInfo,
          permissions: payload.data.form.permissions,
        }

        commit('SET_USER_INFO', user, { root: true })

        ApiService.request.mockResolvedValue({
          success: true,
          updatedEntity: payload.data.form,
        })

        return await ApiService.request(
          {
            type: `${payload.customApiPrefix || ApiTypePrefix}${transformNameToType(
              payload.type,
            )}.Update`,
            data: {
              ...payload.data.form,
              id: payload.data.form?.id,
            },
          },
          { withSuccessToast: true, formRef: payload.data.formRef },
        )
      },
    },

    mutations: {
      SET_USER_INFO(state, user) {
        state.user = user
      },
    },

    getters: {
      abilityCan: () => (permission, action) => {
        return canUpdate
      },
      userInfo: () => userInfo,
    },

    state: {
      user: userInfo,
    },
  }
}
