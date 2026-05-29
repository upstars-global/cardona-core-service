import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import ImageDetailField from '../../../../../../../src/components/templates/BaseList/_components/fields/ImageDetailField.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../../../../utils'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { ListSize } from '../../../../../../../src/@model/templates/tableFields'
import {
  checkImagePathForImageField,
  checkImageSize,
  imageBlockTestId,
  imagePath,
} from '../../../../../templates/shared-tests/image-field'

const getMountImageDetailField = setMountComponent(ImageDetailField)

const defaultProps = {
  id: 'some-id',
  imagePath,

  /// Other props
  // compressionForPreview,
  // size
}

let props

describe('ImageDetailField.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders correctly base elements', async () => {
    const wrapper = getMountImageDetailField(props)

    const imagePreviewWrapper: VueWrapper = wrapper.find(getSelectorTestId(imageBlockTestId))

    checkImagePathForImageField(imagePreviewWrapper, props.imagePath)
  })

  it('Emits show-modal with image path on click', async () => {
    const wrapper = getMountImageDetailField(props)

    await clickTrigger({ wrapper, testId: imageBlockTestId })

    expect(wrapper.emitted('show-modal')).toBeTruthy()
    expect(wrapper.emitted('show-modal')[0]).toEqual([props.imagePath])
  })

  it('Check set compression for preview ', async () => {
    props.compressionForPreview = 50

    const wrapper = getMountImageDetailField(props)

    /// Check on compression for preview
    const imagePreviewWrapper: VueWrapper = wrapper.find(getSelectorTestId(imageBlockTestId))

    checkImagePathForImageField(imagePreviewWrapper, `${props.imagePath}?ar=${props.compressionForPreview}`)
  })

  it('Check set size for preview ', async () => {
    props.size = ListSize.FULL

    const wrapper = getMountImageDetailField(props)

    checkImageSize(wrapper, ListSize.FULL)

    /// Update props of size
    await wrapper.setProps({ size: ListSize.SM })

    /// Check update params of size
    checkImageSize(wrapper, ListSize.SM)
  })

  it('Not render image without path ', async () => {
    props.imagePath = ''

    const wrapper = getMountImageDetailField(props)

    testOn.notExistElement({ wrapper, testId: imageBlockTestId })
  })
})
