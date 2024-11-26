import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import ImageDetailField from '../../../../../../../src/components/templates/BaseList/_components/fields/ImageDetailField.vue'
import { clickTrigger, setMountComponent } from '../../../../../utils'
import { mockModal } from '../../../../../mocks/modal-provide-config'
import {
  callActionShowForInternalBaseModal,
} from '../../../../../templates/shared-tests/modal'
import { testOn } from '../../../../../templates/shared-tests/test-case-generator'
import { ListSize } from '../../../../../../../src/@model/templates/tableFields'

const getMountImageDetailField = setMountComponent(ImageDetailField)

const defaultProps = {
  id: 'test-id',
  imagePath: 'https://some-image-path.com',

  /// Other props
  // compressionForPreview,
  // size
}

let props

const global = { provide: { modal: mockModal } }

const checkImageSize = (wrapper: VueWrapper, size: ListSize) => {
  testOn.existClass({ wrapper, testId: 'image-preview' }, `img-block--${size}`)
}

describe('TableFields.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders correctly base elements', async () => {
    const wrapper = getMountImageDetailField(props, global)

    await clickTrigger({ wrapper, testId: 'image-preview' })

    // Check that image detail has not existed
    testOn.notExistElement({ wrapper, testId: 'image-detail' })

    /// Check on valid call action showModal
    expect(mockModal.showModal).toHaveBeenCalledWith(`${props.id}-image-detail`)

    await callActionShowForInternalBaseModal(wrapper)

    /// Check that image detail exists
    testOn.existElement({ wrapper, testId: 'image-detail' })
  })

  it('Check set compression for preview ', async () => {
    props.compressionForPreview = 50

    const wrapper = getMountImageDetailField(props, global)

    /// Check on compression for preview
    testOn.includePropertyStyle({
      wrapper,
      testId: 'image-preview',
    },
    {
      'background-image': `url(${props.imagePath}?ar=${props.compressionForPreview})`,
    })
  })

  it('Check set size for preview ', async () => {
    props.size = ListSize.FULL

    const wrapper = getMountImageDetailField(props, global)

    checkImageSize(wrapper, ListSize.FULL)

    /// Update props of size
    await wrapper.setProps({ size: ListSize.SM })

    /// Check update params of size
    checkImageSize(wrapper, ListSize.SM)
  })

  it('Not render image without path ', async () => {
    props.imagePath = ''

    const wrapper = getMountImageDetailField(props, global)

    testOn.notExistElement({ wrapper, testId: 'image-preview' })
  })
})
