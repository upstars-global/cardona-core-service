declare global {
  interface Array<T> {
    isEmpty: boolean
    isNotEmpty: boolean
  }
}

Object.defineProperty(Array.prototype, 'isEmpty', {
  get() {
    return this.length === 0
  },
})

Object.defineProperty(Array.prototype, 'isNotEmpty', {
  get() {
    return this.length > 0
  },
})

export {}
