import { beforeEach, describe, expect, it } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import ImageDetailField from '../../../../../../../src/components/templates/BaseList/_components/fields/ImageDetailField.vue'
import { clickTrigger, getSelectorTestId, setMountComponent } from '../../../../../utils'
import { mockModal } from '../../../../../mocks/modal-provide-config'
import {
  callActionShowForInternalBaseModal,
} from '../../../../../templates/shared-tests/modal'
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

const imageDetailTestId = 'image-detail'
const global = { provide: { modal: mockModal } }

describe('TableFields.vue', () => {
  beforeEach(() => {
    props = { ...defaultProps }
  })

  it('Renders correctly base elements', async () => {
    const wrapper = getMountImageDetailField(props, global)

    await clickTrigger({ wrapper, testId: imageBlockTestId })

    // Check that image detail has not existed
    testOn.notExistElement({ wrapper, testId: imageDetailTestId })

    /// Check on valid call action showModal
    expect(mockModal.showModal).toHaveBeenCalledWith(`${props.id}-image-detail`)

    await callActionShowForInternalBaseModal(wrapper)

    /// Check that image detail exists
    testOn.existElement({ wrapper, testId: imageDetailTestId })
  })

  it('Check set compression for preview ', async () => {
    props.compressionForPreview = 50

    const wrapper = getMountImageDetailField(props, global)

    /// Check on compression for preview
    const imagePreviewWrapper: VueWrapper = wrapper.find(getSelectorTestId(imageBlockTestId))

    checkImagePathForImageField(imagePreviewWrapper, `${props.imagePath}?ar=${props.compressionForPreview}`)
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

    testOn.notExistElement({ wrapper, testId: imageBlockTestId })
  })
})
