import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from 'vuex'
import { mount } from '@vue/test-utils'
import FroalaEditor from 'froala-editor'
import TextEditor from '../../../../src/components/TextEditorWysiwyg/index.vue'

let mockDispatch

const mockModal = {
  registerModal: vi.fn(),
  showModal: vi.fn(),
  hideModal: vi.fn(),
}

const mockStore = createStore({
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
})

vi.mock('vuex', async importOriginal => {
  const original = await importOriginal()

  return {
    ...original,
    useStore: () => mockStore,
  }
})

beforeEach(() => {
  mockDispatch = vi.spyOn(mockStore, 'dispatch')
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
      on: vi.fn(),
      trigger: vi.fn(),
    },
  },
}))

const MockFroala = {
  template: '<div class="mock-froala"><textarea>{{ value }}</textarea></div>',
  props: ['tag', 'config', 'value'],
}

describe('TextEditorWysiwyg.vue', () => {
  it('renders correctly and initializes Froala', () => {
    const wrapper = mount(TextEditor, {
      props: {
        modelValue: '<p>Initial content</p>',
        optionsVariable: ['var1', 'var2'],
        localisationParameters: { var1: 'Value1' },
      },
      global: {
        plugins: [mockStore],
        provide: {
          modal: mockModal,
        },
        stubs: {
          Froala: MockFroala,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(FroalaEditor.DefineIcon).toHaveBeenCalled()
    expect(FroalaEditor.RegisterCommand).toHaveBeenCalled()
    console.log(wrapper.html())
  })

  //
  // it('handles content changes correctly', async () => {
  //   const wrapper = mount(TextEditor, {
  //     props: {
  //       modelValue: '<p>Initial content</p>',
  //     },
  //     global: {
  //       plugins: [mockStore],
  //     },
  //   })
  //
  //   FroalaEditor.html.get.mockReturnValue('<p>Updated content</p>')
  //   FroalaEditor.events.trigger('contentChanged')
  //   await wrapper.vm.$nextTick()
  //
  //   expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  //   expect(wrapper.emitted('update:modelValue')[0][0]).toBe('<p>Updated content</p>')
  // })
  //
  // it('inserts images correctly', async () => {
  //   const wrapper = mount(TextEditor, {
  //     props: {
  //       modelValue: '<p>Initial content</p>',
  //     },
  //     global: {
  //       plugins: [mockStore],
  //     },
  //   })
  //
  //   const publicPath = '/mock/path/to/image.jpg'
  //   const fileName = 'image.jpg'
  //
  //   await wrapper.vm.insertImages({ publicPath, fileName })
  //
  //   expect(FroalaEditor.image.insert).toHaveBeenCalledWith(
  //     publicPath,
  //     true,
  //     { name: fileName, id: fileName },
  //     '',
  //     { link: publicPath },
  //   )
  // })
})
