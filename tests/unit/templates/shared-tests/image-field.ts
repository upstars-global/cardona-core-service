import type { VueWrapper } from '@vue/test-utils'
import { expect } from 'vitest'
import { testOn } from './test-case-generator'

export const imagePath = 'https://some-image-path.com'

export const imageBlockTestId = 'image-block'

export const checkImageSize = (wrapper: VueWrapper, size) => {
  testOn.existClass({ wrapper, testId: 'image-block' }, `img-block--${size}`)
}

export const checkImagePathForImageField = (wrapper: VueWrapper, path: string) => {
  const normalizeStyle = (style: string) => style.replace(/["']/g, '')

  expect(normalizeStyle(wrapper.attributes().style)).toContain(`background-image: url(${path});`)
}
