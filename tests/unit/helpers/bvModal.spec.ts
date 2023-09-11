import { mount } from '@vue/test-utils'
import { useBvModal, useModal } from '../../../src/helpers/bvModal'
import i18n from '../../../src/libs/i18n/index'

const mockBvModal = {
  msgBoxConfirm: jest.fn(),
}
jest.mock('vue', () => ({
  ...jest.requireActual('vue'),
  getCurrentInstance: () => ({
    proxy: {
      $bvModal: mockBvModal,
    },
  }),
}))

describe('useBvModal', () => {
  it('should return $bvModal', () => {
    const result = useBvModal()
    expect(result).toBe(mockBvModal)
  })
})

describe('useModal', () => {
  it('should call $bvModal.msgBoxConfirm with correct arguments', () => {
    const confirmationModal = useModal().confirmationModal
    const localeKey = 'test'
    const type = 'Delete'

    confirmationModal(localeKey, type)

    expect(mockBvModal.msgBoxConfirm).toHaveBeenCalledWith(
      i18n.t(`modal.${localeKey}.description`),
      {
        title: i18n.t(`modal.${localeKey}.title`),
        size: 'sm',
        okVariant: 'danger',
        okTitle: i18n.t('action.remove'),
        cancelVariant: 'outline-secondary',
        cancelTitle: i18n.t('action.cancel'),
        hideHeaderClose: false,
        centered: true,
      }
    )
  })
})
