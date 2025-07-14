export class StoresRegister {
  private static stores = new Map<string, any>()

  static setStore(name: string, store: any) {
    this.stores.set(name, store())

    return this
  }

  static getStore(name: string) {
    return this.stores.get(name)
  }
}
