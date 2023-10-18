declare global {
  interface String {
    isEmpty: boolean
    isNotEmpty: boolean
  }
}

Object.defineProperty(String.prototype, 'isEmpty', {
  get() {
    return this.length === 0
  },
})

Object.defineProperty(String.prototype, 'isNotEmpty', {
  get() {
    return this.length > 0
  },
})

export {}
