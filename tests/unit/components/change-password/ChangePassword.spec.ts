import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'

const mockUpdateUserPassword = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const mockTransformFormData = vi.hoisted(() => vi.fn(() => ({ password: 'test-password' })))

vi.mock('../../../../src/stores/users', () => ({
  useUsersStore: vi.fn(() => ({
    updateUserPassword: mockUpdateUserPassword,
  })),
}))

vi.mock('../../../../src/helpers', () => ({
  transformFormData: mockTransformFormData,
}))

import ChangePassword from '../../../../src/components/change-password/ChangePassword.vue'
import { clickTrigger, setMountComponent } from '../../utils'
import { testOn } from '../../templates/shared-tests/test-case-generator'
import { mockModal } from '../../mocks/modal-provide-config'
import { callActionShowForInternalBaseModal, isEqualModalTitle } from '../../templates/shared-tests/modal'
import { i18n } from '../../../../src/plugins/i18n'
import { ModalsId } from '../../../../src/@model/modalsId'

const mockValidate = vi.fn().mockResolvedValue(true)

const BaseSectionStub = {
  name: 'BaseSection',
  props: ['useEntity', 'config', 'withReadAction', 'pageType'],
  template: '<div><slot :form="form" /></div>',
  data() {
    return {
      form: { password: { value: 'test-password' } },
    }
  },
  methods: {
    validate: mockValidate,
  },
}

const getMountChangePassword = setMountComponent(ChangePassword)

interface ChangePasswordProps {
  id: string | number
  isProduct?: boolean
}

const createDefaultProps = (overrides: Partial<ChangePasswordProps> = {}): ChangePasswordProps => ({
  id: 'user-1',
  isProduct: true,
  ...overrides,
})

const globalConfig = {
  provide: { modal: mockModal },
  stubs: {
    BaseSection: BaseSectionStub,
    FieldGenerator: { template: '<div />' },
  },
}

describe('ChangePassword.vue', () => {
  let props: ChangePasswordProps

  beforeEach(() => {
    props = createDefaultProps()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders modal with correct title', async () => {
      const wrapper = getMountChangePassword(props, globalConfig)

      await callActionShowForInternalBaseModal(wrapper)

      isEqualModalTitle(wrapper, i18n.t('modal.changePassword.title'))
    })
  })

  describe('Cancel action', () => {
    it('hides the modal when cancel button is clicked', async () => {
      const wrapper = getMountChangePassword(props, globalConfig)

      await callActionShowForInternalBaseModal(wrapper)
      await clickTrigger({ wrapper, testId: 'btn-cancel' })

      testOn.checkExistCalledMethodWithArguments(
        { wrapper: mockModal.hideModal },
        ModalsId.ChangePassword,
      )
    })
  })

  describe('Accept action', () => {
    it('does not call updateUserPassword when form validation fails', async () => {
      mockValidate.mockResolvedValueOnce(false)

      const wrapper = getMountChangePassword(props, globalConfig)

      await callActionShowForInternalBaseModal(wrapper)
      await clickTrigger({ wrapper, testId: 'btn-accept' })
      await flushPromises()

      testOn.checkNotExistCalledMethod({ wrapper: mockUpdateUserPassword })
    })

    it('calls updateUserPassword with correct payload when form is valid', async () => {
      const wrapper = getMountChangePassword(props, globalConfig)

      await callActionShowForInternalBaseModal(wrapper)
      await clickTrigger({ wrapper, testId: 'btn-accept' })
      await flushPromises()

      testOn.checkExistCalledMethodWithArguments(
        { wrapper: mockUpdateUserPassword },
        { id: props.id, password: 'test-password', isProduct: props.isProduct },
      )
    })

    it('passes isProduct=false to updateUserPassword when prop is false', async () => {
      props = createDefaultProps({ isProduct: false })
      const wrapper = getMountChangePassword(props, globalConfig)

      await callActionShowForInternalBaseModal(wrapper)
      await clickTrigger({ wrapper, testId: 'btn-accept' })
      await flushPromises()

      testOn.checkExistCalledMethodWithArguments(
        { wrapper: mockUpdateUserPassword },
        { id: props.id, password: 'test-password', isProduct: false },
      )
    })

    it('hides the modal after successful password update', async () => {
      const wrapper = getMountChangePassword(props, globalConfig)

      await callActionShowForInternalBaseModal(wrapper)
      await clickTrigger({ wrapper, testId: 'btn-accept' })
      await flushPromises()

      testOn.checkExistCalledMethodWithArguments(
        { wrapper: mockModal.hideModal },
        ModalsId.ChangePassword,
      )
    })

    it('does not close modal when form validation fails', async () => {
      mockValidate.mockResolvedValueOnce(false)

      const wrapper = getMountChangePassword(props, globalConfig)

      await callActionShowForInternalBaseModal(wrapper)
      await clickTrigger({ wrapper, testId: 'btn-accept' })
      await flushPromises()

      testOn.checkNotExistCalledMethod({ wrapper: mockModal.hideModal })
    })
  })
})
