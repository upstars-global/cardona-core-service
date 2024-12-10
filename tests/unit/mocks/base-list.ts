import { vi } from 'vitest'

export const exportDataMock = () => {
  if (!window.URL.createObjectURL) {
    Object.defineProperty(window.URL, 'createObjectURL', {
      writable: true,
      configurable: true,
      value: vi.fn(() => 'mocked-url'),
    })
  }
  else {
    vi.spyOn(window.URL, 'createObjectURL').mockImplementation(() => 'mocked-url')
  }

  // Мокаем `document.createElement` только для элементов <a>
  const originalCreateElement = document.createElement

  vi.spyOn(document, 'createElement').mockImplementation(tagName => {
    if (tagName === 'a') {
      const anchorElement = originalCreateElement.call(document, 'a')

      vi.spyOn(anchorElement, 'click').mockImplementation(() => {})

      return anchorElement
    }

    return originalCreateElement.call(document, tagName)
  })
}

export const toastErrorMock = vi.fn()
export const toastSuccessMock = vi.fn()
export const toastErrorMessageStringMock = vi.fn()

vi.mock('../../../../../src/helpers/toasts', () => ({
  default: vi.fn(() => ({
    toastError: toastErrorMock,
    toastSuccess: toastSuccessMock,
    toastErrorMessageString: toastErrorMessageStringMock,
  })),
}))
