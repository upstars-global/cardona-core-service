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

interface VersionedStorageData<T> {
  version: number
  data: T
}

export type StorageMigrationCallback<T> = (
  data: unknown,
  storedVersion: number | null,
  currentVersion: number,
) => T

export interface GetVersionedStorageOptions<T> {
  key: string
  version?: number
  callback?: StorageMigrationCallback<T>
}

export interface SetVersionedStorageOptions<T> {
  key: string
  data: T
  version?: number
}

const isVersionedStorageData = (value: unknown): value is VersionedStorageData<unknown> => {
  if (!value || typeof value !== 'object')
    return false

  return 'version' in value
    && typeof value.version === 'number'
    && 'data' in value
}

export const setVersionedStorage = <T>({
  key,
  data,
  version = 1,
}: SetVersionedStorageOptions<T>): void => {
  setStorage<VersionedStorageData<T>>(key, { version, data })
}

/**
 * Get versioned value from the local storage.
 *
 * The callback is always called when provided. For legacy or outdated data,
 * its result is persisted with the current version. Without a callback,
 * incompatible data is ignored and an error is logged.
 */
export const getVersionedStorage = <T>({
  key,
  version = 1,
  callback,
}: GetVersionedStorageOptions<T>): T | null => {
  const item = localStorage.getItem(key)

  if (!item) {
    if (!callback)
      return null

    try {
      const data = callback(null, null, version)

      setVersionedStorage({ key, version, data })

      return data
    }
    catch (error) {
      console.error(new Error(`Failed to initialize versioned storage for key "${key}"`, { cause: error }))

      return null
    }
  }

  let parsedData: unknown

  try {
    parsedData = JSON.parse(item)
  }
  catch (error) {
    if (!callback) {
      console.error(new Error(`Failed to read versioned storage for key "${key}"`, { cause: error }))

      return null
    }

    try {
      const data = callback(null, null, version)

      setVersionedStorage({ key, version, data })

      return data
    }
    catch (callbackError) {
      console.error(new Error(`Failed to migrate versioned storage for key "${key}"`, { cause: callbackError }))

      return null
    }
  }

  try {
    const storedVersion = isVersionedStorageData(parsedData) ? parsedData.version : null
    const data = isVersionedStorageData(parsedData) ? parsedData.data : parsedData

    if (callback) {
      const migratedData = callback(data, storedVersion, version)

      if (storedVersion !== version)
        setVersionedStorage({ key, version, data: migratedData })

      return migratedData
    }

    if (storedVersion !== version) {
      console.error(new Error(`Storage version mismatch for key "${key}": expected ${version}, received ${storedVersion ?? 'legacy'}`))

      return null
    }

    return data as T
  }
  catch (error) {
    console.error(new Error(`Failed to migrate versioned storage for key "${key}"`, { cause: error }))

    return null
  }
}

/**
 * Get list of instance of the local storage by key
 * Returns Array<T>
 *
 * @param {string} cls class constructor for create instance from raw data
 */
export const getListStorage
  = <T>(cls: { new (data: any): T }) =>
    (key: string): T[] => {
      const value = localStorage.getItem(key)
      if (value) {
        const list: any[] = JSON.parse(value) || []

        return list.map(item => {
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
  Object.keys(localStorage).forEach(key => {
    if (key.includes(slug))
      localStorage.removeItem(key)
  })
}
