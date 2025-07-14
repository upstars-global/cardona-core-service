import { StoresRegister } from '../services/stores'
import { useDemoStore } from '../stores/demo'

StoresRegister.setStore('demo', useDemoStore)

export const storesRegister = StoresRegister

export const getStore = (name: string) => storesRegister.getStore(name)
