/**
 * Set value to the local storage
 *
 * @param {string} key of the local storage
 * @param {T} data for set to the local storage by key
 */

export const setStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data))
}

/**
 * Get instance value of the local storage by key
 *
 * @param {string} key storage key
 * @param {FunctionConstructor} cls class constructor for create instance from raw data
 */

export const getStorage = <T>(key: string, cls?: { new (data: any): T }): T | string | null => {
  const item = localStorage.getItem(key)

  return item && cls ? new cls(JSON.parse(item)) : item
}

/**
 * Get list of instance of the local storage by key
 * Returns Array<T>
 *
 * @param {string} cls class constructor for create instance from raw data
 */
export const getListStorage =
  <T>(cls: { new (data: any): T }) =>
  (key: string): T[] => {
    const value = localStorage.getItem(key)
    if (value) {
      const list: any[] = JSON.parse(value) || []

      return list.map((item) => {
        return new cls(item)
      })
    }

    return []
  }

/**
 * Get rid of data from local storage by key
 *
 * @param {string} key of the local storage
 */
export const removeStorageItem = (key: string): void => {
  localStorage.removeItem(key)
}

export const clearStorageAllKeyBySlug = (slug: string): void => {
  Object.keys(localStorage).forEach((key) => {
    if (key.includes(slug)) {
      localStorage.removeItem(key)
    }
  })
}
