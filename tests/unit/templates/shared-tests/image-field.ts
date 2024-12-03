import type { VueWrapper } from '@vue/test-utils'
import { testOn } from './test-case-generator'

export const imagePath = 'https://some-image-path.com'

export const imageBlockTestId = 'image-block'

export const checkImageSize = (wrapper: VueWrapper, size) => {
  testOn.existClass({ wrapper, testId: 'image-block' }, `img-block--${size}`)
}

export const checkImagePathForImageField = (wrapper: VueWrapper, path: string) => {
  testOn.includePropertyStyle({ wrapper }, { 'background-image': `url(${path})` })
}
