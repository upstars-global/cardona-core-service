import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import ModalFooter from '../../../../src/components/BaseModal/ModalFooter.vue'
import { i18n } from '../../../../src/plugins/i18n'
import { clickTrigger, setMountComponent } from '../../utils'
import { testOn } from '../../templates/shared-tests/test-case-generator'

const getMountModalFooter = setMountComponent(ModalFooter)

interface ButtonConfig {
  label?: string
  disabled?: boolean
}

interface ModalFooterProps {
  accept: ButtonConfig
  cancel: ButtonConfig
}

const createDefaultProps = (overrides: Partial<ModalFooterProps> = {}): ModalFooterProps => ({
  accept: {},
  cancel: {},
  ...overrides,
})

describe('ModalFooter.vue', () => {
  let props: ModalFooterProps

  beforeEach(() => {
    props = createDefaultProps()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders accept and cancel buttons', () => {
      const wrapper = getMountModalFooter(props)

      testOn.existElement({ wrapper, testId: 'btn-accept' })
      testOn.existElement({ wrapper, testId: 'btn-cancel' })
    })

    it('shows default i18n label for cancel button when no label provided', () => {
      const wrapper = getMountModalFooter(props)

      testOn.existTextValue({ wrapper, testId: 'btn-cancel' }, i18n.t('action.cancel'))
    })

    it('shows custom label for cancel button', () => {
      props = createDefaultProps({ cancel: { label: 'Dismiss' } })
      const wrapper = getMountModalFooter(props)

      testOn.existTextValue({ wrapper, testId: 'btn-cancel' }, 'Dismiss')
    })

    it('shows custom label for accept button', () => {
      props = createDefaultProps({ accept: { label: 'Save' } })
      const wrapper = getMountModalFooter(props)

      testOn.existTextValue({ wrapper, testId: 'btn-accept' }, 'Save')
    })
  })

  describe('Events', () => {
    it('emits "onAccept" when accept button is clicked', async () => {
      const wrapper = getMountModalFooter(props)

      await clickTrigger({ wrapper, testId: 'btn-accept' })

      testOn.isCalledEmitEvent({ wrapper }, 'onAccept')
    })

    it('emits "onCancel" when cancel button is clicked', async () => {
      const wrapper = getMountModalFooter(props)

      await clickTrigger({ wrapper, testId: 'btn-cancel' })

      testOn.isCalledEmitEvent({ wrapper }, 'onCancel')
    })
  })

  describe('Disabled state', () => {
    it('accept button is disabled when accept.disabled is true', () => {
      props = createDefaultProps({ accept: { disabled: true } })
      const wrapper = getMountModalFooter(props)

      testOn.existClass({ wrapper, testId: 'btn-accept' }, 'v-btn--disabled')
    })

    it('cancel button is disabled when cancel.disabled is true', () => {
      props = createDefaultProps({ cancel: { disabled: true } })
      const wrapper = getMountModalFooter(props)

      testOn.existClass({ wrapper, testId: 'btn-cancel' }, 'v-btn--disabled')
    })

    it('accept button is not disabled by default', () => {
      const wrapper = getMountModalFooter(props)

      testOn.notExistClasses({ wrapper, testId: 'btn-accept' }, 'v-btn--disabled')
    })

    it('cancel button is not disabled by default', () => {
      const wrapper = getMountModalFooter(props)

      testOn.notExistClasses({ wrapper, testId: 'btn-cancel' }, 'v-btn--disabled')
    })
  })

  describe('Slots', () => {
    it('renders content in start slot', () => {
      const wrapper = getMountModalFooter(props, {}, {
        start: '<div data-test-id="start-slot-content">Start</div>',
      })

      testOn.existElement({ wrapper, testId: 'start-slot-content' })
    })

    it('renders content in middle slot', () => {
      const wrapper = getMountModalFooter(props, {}, {
        middle: '<div data-test-id="middle-slot-content">Middle</div>',
      })

      testOn.existElement({ wrapper, testId: 'middle-slot-content' })
    })

    it('renders content in end slot', () => {
      const wrapper = getMountModalFooter(props, {}, {
        end: '<div data-test-id="end-slot-content">End</div>',
      })

      testOn.existElement({ wrapper, testId: 'end-slot-content' })
    })
  })
})
