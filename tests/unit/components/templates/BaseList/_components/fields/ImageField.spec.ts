import { beforeEach, describe, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import ImageField from '../../../../../../../src/components/templates/BaseList/_components/fields/ImageField.vue'
import { setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { ListSize } from '../../../../../../../src/@model/templates/tableFields'

const getMountImageField = setMountComponent(ImageField)

const defaultProps = {
  imagePath: 'https://some-image-path.com',
}

let props

const checkImageSize = (wrapper: VueWrapper, size: ListSize) => {
  testOn.existClass({ wrapper, testId: 'image-block' }, `img-block--${size}`)
}

describe('TableFields.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders correctly base elements', () => {
    const wrapper = getMountImageField(props)

    // Check render default size
    checkImageSize(wrapper, ListSize.MD)
  })

  it('Check correctly base elements', () => {
    const wrapper = getMountImageField(props)

    /// Check put image path in background-image style
    testOn.includePropertyStyle({ wrapper }, { 'background-image': `url(${props.imagePath})` })
  })

  it('Check on set size for image', async () => {
    props.size = ListSize.SM

    const wrapper = getMountImageField(props)

    checkImageSize(wrapper, ListSize.SM)

    /// Update props of size
    await wrapper.setProps({ size: ListSize.FULL })

    /// Check class for full size
    checkImageSize(wrapper, ListSize.FULL)
  })
})
