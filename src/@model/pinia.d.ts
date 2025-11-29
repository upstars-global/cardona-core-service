import {useUserStore} from "../stores/user";

export type UserStore = ReturnType<typeof useUserStore>
declare module 'pinia' {
  export interface PiniaCustomProperties {
    $selectedProjectAlias: UserStore.getSelectedProjectAlias.alias | string
  }
}
