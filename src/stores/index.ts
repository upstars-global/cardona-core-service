import { StoresRegister } from '../services/stores'
import { useDemoStore } from '../stores/demo'

const registerStore = StoresRegister

registerStore.setStore('demo', useDemoStore)

export const getStore = (name: string) => registerStore.getStore(name)
