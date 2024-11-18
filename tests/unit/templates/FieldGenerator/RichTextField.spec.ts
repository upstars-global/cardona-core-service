import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from 'vuex'
import FroalaEditor from 'froala-editor'
import { nextTick } from 'vue'
import TextEditor from '../../../../src/components/TextEditorWysiwyg/index.vue'
import { mockModal } from '../../mocks/modal-provide-config'
import { setMountComponent } from '../../utils'
import { testOn } from '../shared-tests/test-case-generator'

let mockDispatch

const mockStoreConfig = {
  modules: {
    textEditor: {
      namespaced: true,
      state: {
        isUpdateVar: false,
        variableTextBuffer: {
          variable1: 'Value 1',
          variable2: 'Value 2',
        },
      },
      actions: {
        setVariableTextBuffer: vi.fn(),
        setVariableByKey: vi.fn(),
        removeVariableValueByKey: vi.fn(),
      },
    },
    appConfigCore: {
      namespaced: true,
      getters: {
        allCurrencies: () => ['USD', 'EUR', 'GBP'],
      },
    },
  },
  getters: {
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
      template: '<div class="mock-froala"><textarea>{{ value }}</textarea></div>',
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
  mockDispatch = vi.spyOn(mockStoreConfig.modules.textEditor.actions, 'setVariableTextBuffer')
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
  it('Renders correctly and initializes Froala', async () => {
    const wrapper = mountTextEditor(
      defaultProps,
      defaultGlobalConfig,
    )

    expect(wrapper.exists()).toBe(true)
    expect(FroalaEditor.DefineIcon).toHaveBeenCalled()
    expect(FroalaEditor.RegisterCommand).toHaveBeenCalled()
    await wrapper.setProps({ modelValue: '{{Test}}' })
    console.log(wrapper.html())
  })

  it('Handles variable updates correctly', async () => {
    const wrapper = mountTextEditor(
      defaultProps,
      defaultGlobalConfig,
    )

    await wrapper.setProps({ localisationParameters: { var1: 'UpdatedValue1' } })
    expect(mockDispatch).toHaveBeenCalledWith(expect.anything(), { var1: 'UpdatedValue1' })
  })

  it('Calls modal to insert image', async () => {
    const wrapper = mountTextEditor(
      defaultProps,
      defaultGlobalConfig,
    )

    wrapper.vm.globalEditor = {
      image: {
        insert: vi.fn(),
        hideProgressBar: vi.fn(),
      },
    }

    wrapper.vm.insertImages({ publicPath: '/path/to/image.jpg', fileName: 'image.jpg' })

    await nextTick()

    expect(mockModal.hideModal).toHaveBeenCalledWith('gallery-modal')
    expect(wrapper.vm.globalEditor.image.insert).toHaveBeenCalledWith(
      '/path/to/image.jpg',
      true,
      { name: 'image.jpg', id: 'image.jpg' },
      '',
      { link: '/path/to/image.jpg' },
    )
    expect(wrapper.vm.globalEditor.image.hideProgressBar).toHaveBeenCalledWith(true)
  })

  it('Handles variable key selection for editing', async () => {
    const wrapper = mountTextEditor(
      defaultProps,
      defaultGlobalConfig,
    )

    wrapper.vm.setVariableKeySelect('var1')

    expect(wrapper.vm.variableKeySelect).toBe('var1')

    await nextTick()
    expect(mockModal.showModal).toHaveBeenCalledWith('variable-modal')
  })

  it('Disables editing when disabled prop is true', async () => {
    const wrapper = mountTextEditor(
      { ...defaultProps, disabled: true },
      defaultGlobalConfig,
    )

    wrapper.vm.globalEditor = {
      edit: { off: vi.fn() },
    }
    wrapper.vm.config.events.initialized.call(wrapper.vm.globalEditor)

    await nextTick()

    expect(wrapper.vm.globalEditor).toBeDefined()
    expect(wrapper.vm.globalEditor.edit.off).toHaveBeenCalled()
    expect(wrapper.find('.editor-wrap').classes()).toContain('disabled')
  })

  it('Emits update:modelValue when content changes', async () => {
    const wrapper = mountTextEditor(
      defaultProps,
      defaultGlobalConfig,
    )

    const newContent = '<p>Updated content</p>'

    const contentChangedEvent = wrapper.vm.config.events.contentChanged

    contentChangedEvent.call({
      html: {
        get: () => newContent,
      },
    })

    await nextTick()

    testOn.isCalledEmittedEvent({
      wrapper,
    })

    testOn.isEqualEmittedValue({ wrapper }, [[newContent]])
  })
})
