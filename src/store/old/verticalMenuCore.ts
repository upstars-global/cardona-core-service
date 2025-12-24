import { getStorage, removeStorageItem, setStorage } from '../../helpers/storage'
import { storageKeys } from '../../configs/storage'

export default {
  namespaced: true,
  state: {
    isVerticalMenuCollapsed: !!getStorage(storageKeys.menuCollapsed),
  },
  mutations: {
    UPDATE_VERTICAL_MENU_COLLAPSED(state, val: boolean) {
      val
        ? setStorage(storageKeys.menuCollapsed, true)
        : removeStorageItem(storageKeys.menuCollapsed)

      state.isVerticalMenuCollapsed = val
    },
  },
}
