import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from 'vuex'
import FroalaEditor from 'froala-editor'
import { nextTick } from 'vue'
import TextEditor from '../../../../src/components/TextEditorWysiwyg/index.vue'
import { mockModal } from '../../mocks/modal-provide-config'
import { setMountComponent } from '../../utils'
import { testOn } from '../shared-tests/test-case-generator'

/// Create mocked method body
const setVariableTextBufferMock = vi.fn()

vi.mock('../../../../src/stores/textEditor', () => ({
  useTextEditorStore: () => ({
    variableTextBuffer: {
      variable1: 'Value 1',
      variable2: 'Value 2',
    },

    /// Set mocked body method into mocked store
    setVariableTextBuffer: setVariableTextBufferMock,
  }),
}))

const mockStoreConfig = {
  modules: {
    appConfigCore: {
      namespaced: true,
      getters: {
        allCurrencies: () => ['USD', 'EUR', 'GBP'],
      },
    },
  },
  getters: {
    abilityCan: () => vi.fn(() => true),
    selectedProject: () => ({
      title: 'Mock Project',
      publicName: 'MockProject',
    }),
  },
}

const defaultProps = {
  modelValue: '<p>Initial content</p>',
  optionsVariable: ['var1', 'var2'],
  localisationParameters: { var1: 'Value1', var2: 'Value2' },
}

const mountTextEditor = setMountComponent(TextEditor)

const defaultGlobalConfig = {
  plugins: [createStore(mockStoreConfig)],
  provide: { modal: mockModal },
  stubs: {
    Froala: {
      template: '<div class="mock-froala"><textarea data-test-id="mocked-text-editor">{{ value }}</textarea></div>',
      props: ['tag', 'config', 'value'],
    },
  },
}

vi.mock('vuex', async importOriginal => {
  const original = await importOriginal()

  return {
    ...original,
    useStore: () => createStore(mockStoreConfig),
  }
})

beforeEach(() => {
  /// Reset state mocked method before run each test
  setVariableTextBufferMock.mockReset()
})

vi.mock('froala-editor', () => ({
  default: {
    DefineIcon: vi.fn(),
    RegisterCommand: vi.fn(),
    ENTER_BR: 'ENTER_BR',
    html: {
      get: vi.fn(() => '<p>Mocked content</p>'),
      set: vi.fn(),
    },
    image: {
      insert: vi.fn(),
      hideProgressBar: vi.fn(),
    },
    selection: {
      save: vi.fn(),
      restore: vi.fn(),
      setAfter: vi.fn(),
      element: vi.fn(() => document.createElement('span')),
    },
    edit: {
      off: vi.fn(),
      on: vi.fn(),
    },
    codeView: {
      toggle: vi.fn(),
      isActive: vi.fn(() => false),
    },
    events: {
      on: vi.fn((event, callback) => {
        if (event === 'initialized')
          callback()
      }),
      trigger: vi.fn(),
    },
  },
}))

describe('TextEditorWysiwyg.vue', () => {
  describe('TextEditorWysiwyg.vue', () => {
    it('Renders correctly and initializes Froala', async () => {
      const wrapper = mountTextEditor(
        defaultProps,
        defaultGlobalConfig,
      )

      // Check if the component exists in the DOM
      expect(wrapper.exists()).toBe(true)

      // Verify if Froala methods are called during initialization
      expect(FroalaEditor.DefineIcon).toHaveBeenCalled()
      expect(FroalaEditor.RegisterCommand).toHaveBeenCalled()

      // Update props and log the output for debugging
      await wrapper.setProps({ modelValue: '{{Test}}' })
    })

    it('Handles variable updates correctly', async () => {
      const wrapper = mountTextEditor(
        defaultProps,
        defaultGlobalConfig,
      )

      // Simulate updating the localisationParameters prop
      await wrapper.setProps({ localisationParameters: { var1: 'UpdatedValue1' } })

      // Check if the Vuex action was dispatched with the correct payload
      expect(setVariableTextBufferMock).toHaveBeenLastCalledWith({ var1: 'UpdatedValue1' })
    })

    it('Calls modal to insert image', async () => {
      const wrapper = mountTextEditor(
        defaultProps,
        defaultGlobalConfig,
      )

      // Mock the globalEditor object for the Froala editor
      wrapper.vm.globalEditor = {
        image: {
          insert: vi.fn(),
          hideProgressBar: vi.fn(),
        },
      }

      // Simulate the insertImages method
      wrapper.vm.insertImages({ publicPath: '/path/to/image.jpg', fileName: 'image.jpg' })

      // Wait for the DOM to update
      await nextTick()

      // Verify if the modal was closed
      expect(mockModal.hideModal).toHaveBeenCalledWith('gallery-modal')

      // Verify if the image was inserted correctly
      expect(wrapper.vm.globalEditor.image.insert).toHaveBeenCalledWith(
        '/path/to/image.jpg',
        true,
        { name: 'image.jpg', id: 'image.jpg' },
        '',
        { link: '/path/to/image.jpg' },
      )

      // Check if the progress bar was hidden
      expect(wrapper.vm.globalEditor.image.hideProgressBar).toHaveBeenCalledWith(true)
    })

    it('Handles variable key selection for editing', async () => {
      // Mount the component
      const wrapper = mountTextEditor(
        defaultProps,
        defaultGlobalConfig,
      )

      // Simulate selecting a variable key
      wrapper.vm.setVariableKeySelect('var1')

      // Check if the selected key is set correctly
      expect(wrapper.vm.variableKeySelect).toBe('var1')

      // Wait for the DOM to update
      await nextTick()

      // Verify if the modal was opened
      expect(mockModal.showModal).toHaveBeenCalledWith('variable-modal')
    })

    it('Disables editing when disabled prop is true', async () => {
      const wrapper = mountTextEditor(
        { ...defaultProps, disabled: true },
        defaultGlobalConfig,
      )

      // Mock the globalEditor object
      wrapper.vm.globalEditor = {
        edit: { off: vi.fn() },
      }

      // Simulate the initialization event for Froala
      wrapper.vm.config.events.initialized.call(wrapper.vm.globalEditor)

      // Wait for the DOM to update
      await nextTick()

      // Verify if the editor's edit mode was disabled
      expect(wrapper.vm.globalEditor).toBeDefined()
      expect(wrapper.vm.globalEditor.edit.off).toHaveBeenCalled()

      // Check if the wrapper has the "disabled" class
      expect(wrapper.find('.editor-wrap').classes()).toContain('disabled')
    })

    it('Emits update:modelValue when content changes', async () => {
      const testId = 'mocked-text-editor'

      const wrapper = mountTextEditor(
        defaultProps,
        defaultGlobalConfig,
      )

      // Define the new content to be set
      const newContent = '<p>Updated content</p>'

      /// Check that the initial content is rendered correctly
      testOn.equalTextValue({ wrapper, testId }, defaultProps.modelValue)

      /// Update v-model value
      await wrapper.setProps({ modelValue: newContent })

      /// Await redner value
      await nextTick()

      /// Check that the new content is rendered correctly
      testOn.equalTextValue({ wrapper, testId }, newContent)
    })
  })
})
