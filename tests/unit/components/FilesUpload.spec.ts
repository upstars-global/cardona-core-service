import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import FilesUpload from '../../../src/components/FilesUpload/FilesUpload.vue'
import { clickTrigger, setMountComponent } from '../utils'
import { testOn } from '../templates/shared-tests/test-case-generator'
import { UploadFileSizes } from '../../../src/@model/enums/uploadFileSizes'
import type { VColors, VSizes, VVariants } from '../../../src/@model/vuetify'

interface Props {
  wrapperClass?: string
  textBtn?: string
  size?: UploadFileSizes
  disabled?: boolean
  isError?: boolean
  maxSizeFileMb?: number
  onSubmitCallback?: (...args: unknown[]) => unknown
  onBtnClickCallback?: () => void
  multiple?: boolean
  dataTypes?: string[]
  btnUpload?: { color: VColors; variant: VVariants; size: VSizes }
}

const mockOpen = vi.fn()
const mockToastError = vi.fn()
const isOverDropZoneRef = ref(false)

let capturedOnDrop: ((files: File[] | null) => Promise<void>) | null = null
let capturedOnChange: ((files: FileList | null) => void) | null = null

vi.mock('@vueuse/core', () => ({
  useFileDialog: () => ({
    open: mockOpen,
    onChange: (cb: (files: FileList | null) => void) => {
      capturedOnChange = cb
    },
  }),
  useDropZone: (_ref: unknown, options: { onDrop: (files: File[] | null) => Promise<void> }) => {
    capturedOnDrop = options.onDrop

    return { isOverDropZone: isOverDropZoneRef }
  },
}))

vi.mock('../../../src/helpers/toasts', () => ({
  default: () => ({
    toastError: mockToastError,
  }),
}))

const DATA_TEST_IDS = {
  DROP_FILE_TEXT: 'drop-file-text',
  LOADING_STATE: 'loading-state',
  UPLOAD_BTN: 'upload-btn',
} as const

const MAX_SIZE_FILE_MB = 4

const createFile = (name: string, sizeMb: number, type = 'image/png'): File => {
  const file = new File([''], name, { type })

  Object.defineProperty(file, 'size', { value: Math.round(sizeMb * 1048576) })

  return file
}

const globalConfig = {
  mocks: {
    $t: (key: string) => key,
  },
  stubs: {
    VProgressCircular: { template: '<div class="v-progress-circular-stub" />' },
    VBtn: {
      props: ['disabled', 'color', 'variant', 'size'],
      emits: ['click'],
      template: '<button :disabled="disabled" @click="$emit(\'click\')"><slot /></button>',
    },
  },
}

const getMountFilesUpload = (props: Props, slots?: Record<string, string>) =>
  setMountComponent(FilesUpload)(props, globalConfig, slots)

const defaultProps: Props = {
  wrapperClass: '',
  textBtn: 'Upload file',
}

let props: Props

beforeEach(() => {
  props = { ...defaultProps }
  vi.clearAllMocks()
  isOverDropZoneRef.value = false
  capturedOnDrop = null
  capturedOnChange = null
})

describe('FilesUpload', () => {
  describe('Rendering', () => {
    it('renders with default md size class', () => {
      const wrapper = getMountFilesUpload(props)

      testOn.existClass({ wrapper }, UploadFileSizes.md)
    })

    it('renders with sm size class when provided', () => {
      const wrapper = getMountFilesUpload({ ...props, size: UploadFileSizes.sm })

      testOn.existClass({ wrapper }, UploadFileSizes.sm)
    })

    it('renders with custom wrapper class', () => {
      const wrapper = getMountFilesUpload({ ...props, wrapperClass: 'my-custom-class' })

      testOn.existClass({ wrapper }, 'my-custom-class')
    })

    it('renders upload button with correct textBtn', () => {
      const wrapper = getMountFilesUpload({ ...props, textBtn: 'My Upload Button' })

      testOn.existTextValue({ wrapper, testId: DATA_TEST_IDS.UPLOAD_BTN }, 'My Upload Button')
    })

    it('renders upload button by default', () => {
      const wrapper = getMountFilesUpload(props)

      testOn.existElement({ wrapper, testId: DATA_TEST_IDS.UPLOAD_BTN })
    })

    it('shows drop file text when dragging file over drop zone', async () => {
      const wrapper = getMountFilesUpload(props)

      isOverDropZoneRef.value = true
      await nextTick()

      testOn.existElement({ wrapper, testId: DATA_TEST_IDS.DROP_FILE_TEXT })
      testOn.existTextValue({ wrapper, testId: DATA_TEST_IDS.DROP_FILE_TEXT }, 'placeholder.dropFile')
    })

    it('hides upload button when dragging over drop zone', async () => {
      const wrapper = getMountFilesUpload(props)

      isOverDropZoneRef.value = true
      await nextTick()

      testOn.notExistElement({ wrapper, testId: DATA_TEST_IDS.UPLOAD_BTN })
    })

    it('shows loading indicator during file upload', async () => {
      let resolveUpload!: () => void

      const pendingCallback = vi.fn(
        () => new Promise<void>(resolve => {
          resolveUpload = resolve
        }),
      )

      const wrapper = getMountFilesUpload({ ...props, onSubmitCallback: pendingCallback })

      const file = createFile('test.png', 1)

      capturedOnDrop?.([file]) // intentionally not awaited
      await nextTick()

      testOn.existElement({ wrapper, testId: DATA_TEST_IDS.LOADING_STATE })
      testOn.existTextValue({ wrapper, testId: DATA_TEST_IDS.LOADING_STATE }, 'common.loading')

      resolveUpload()
      await nextTick()
      await nextTick()

      testOn.notExistElement({ wrapper, testId: DATA_TEST_IDS.LOADING_STATE })
    })
  })

  describe('Disabled state', () => {
    it('adds "disabled" class when disabled prop is true', () => {
      const wrapper = getMountFilesUpload({ ...props, disabled: true })

      testOn.existClass({ wrapper }, 'disabled')
    })

    it('disables upload button when disabled prop is true', () => {
      const wrapper = getMountFilesUpload({ ...props, disabled: true })

      testOn.isDisabledElement({ wrapper, testId: DATA_TEST_IDS.UPLOAD_BTN })
    })

    it('does not add "disabled" class when disabled prop is false', () => {
      const wrapper = getMountFilesUpload({ ...props, disabled: false })

      testOn.notExistClasses({ wrapper }, 'disabled')
    })
  })

  describe('Error state', () => {
    it('adds "error" class when isError prop is true', () => {
      const wrapper = getMountFilesUpload({ ...props, isError: true })

      testOn.existClass({ wrapper }, 'error')
    })

    it('does not add "error" class when isError prop is false', () => {
      const wrapper = getMountFilesUpload({ ...props, isError: false })

      testOn.notExistClasses({ wrapper }, 'error')
    })
  })

  describe('Drop zone CSS classes', () => {
    it('adds "files-upload--over-drop" class when dragging over', async () => {
      const wrapper = getMountFilesUpload(props)

      isOverDropZoneRef.value = true
      await nextTick()

      testOn.existClass({ wrapper }, 'files-upload--over-drop')
    })

    it('does not add "files-upload--over-drop" class by default', () => {
      const wrapper = getMountFilesUpload(props)

      testOn.notExistClasses({ wrapper }, 'files-upload--over-drop')
    })
  })

  describe('Button click behavior', () => {
    it('opens file dialog on click when no onBtnClickCallback is provided', async () => {
      const wrapper = getMountFilesUpload(props)

      await clickTrigger({ wrapper, testId: DATA_TEST_IDS.UPLOAD_BTN })

      expect(mockOpen).toHaveBeenCalledTimes(1)
    })

    it('calls onBtnClickCallback on click instead of opening file dialog', async () => {
      const mockBtnCallback = vi.fn()
      const wrapper = getMountFilesUpload({ ...props, onBtnClickCallback: mockBtnCallback })

      await clickTrigger({ wrapper, testId: DATA_TEST_IDS.UPLOAD_BTN })

      expect(mockBtnCallback).toHaveBeenCalledTimes(1)
      expect(mockOpen).not.toHaveBeenCalled()
    })
  })

  describe('File drop handling', () => {
    it('calls onSubmitCallback with single valid file', async () => {
      const mockCallback = vi.fn().mockResolvedValue(undefined)

      getMountFilesUpload({ ...props, onSubmitCallback: mockCallback })

      const file = createFile('test.png', 1)

      await capturedOnDrop?.([file])
      await nextTick()

      expect(mockCallback).toHaveBeenCalledWith(file)
    })

    it('does nothing when null is dropped', async () => {
      const mockCallback = vi.fn()

      getMountFilesUpload({ ...props, onSubmitCallback: mockCallback })

      await capturedOnDrop?.(null)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('does nothing when empty array is dropped', async () => {
      const mockCallback = vi.fn()

      getMountFilesUpload({ ...props, onSubmitCallback: mockCallback })

      await capturedOnDrop?.([])

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('shows toast error when dropped file exceeds maxSizeFileMb', async () => {
      getMountFilesUpload({ ...props, maxSizeFileMb: MAX_SIZE_FILE_MB })

      const file = createFile('large.png', MAX_SIZE_FILE_MB * 2)

      await capturedOnDrop?.([file])
      await nextTick()

      expect(mockToastError).toHaveBeenCalledWith('fileSizeError', { MB: String(MAX_SIZE_FILE_MB) })
    })

    it('does not call onSubmitCallback when all files are too large', async () => {
      const mockCallback = vi.fn()

      getMountFilesUpload({ ...props, onSubmitCallback: mockCallback, maxSizeFileMb: MAX_SIZE_FILE_MB })

      await capturedOnDrop?.([createFile('large.png', MAX_SIZE_FILE_MB * 2)])
      await nextTick()

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('passes array of valid files when multiple is true', async () => {
      const mockCallback = vi.fn().mockResolvedValue(undefined)

      getMountFilesUpload({ ...props, onSubmitCallback: mockCallback, multiple: true })

      const files = [createFile('file1.png', 1), createFile('file2.png', 2)]

      await capturedOnDrop?.(files)
      await nextTick()

      const receivedPayload = mockCallback.mock.calls[0][0]

      expect(receivedPayload).toHaveLength(2)
      expect(receivedPayload[0]).toBe(files[0])
      expect(receivedPayload[1]).toBe(files[1])
    })

    it('passes only first file when multiple is false', async () => {
      const mockCallback = vi.fn().mockResolvedValue(undefined)

      getMountFilesUpload({ ...props, onSubmitCallback: mockCallback, multiple: false })

      const files = [createFile('file1.png', 1), createFile('file2.png', 2)]

      await capturedOnDrop?.(files)
      await nextTick()

      expect(mockCallback).toHaveBeenCalledWith(files[0])
    })

    it('filters out oversized files and processes only valid ones when multiple is true', async () => {
      const mockCallback = vi.fn().mockResolvedValue(undefined)

      getMountFilesUpload({ ...props, onSubmitCallback: mockCallback, multiple: true, maxSizeFileMb: MAX_SIZE_FILE_MB })

      const validFile = createFile('small.png', 1)
      const invalidFile = createFile('big.png', MAX_SIZE_FILE_MB * 2)

      await capturedOnDrop?.([validFile, invalidFile])
      await nextTick()

      expect(mockToastError).toHaveBeenCalledTimes(1)

      const receivedPayload = mockCallback.mock.calls[0][0]

      expect(receivedPayload).toHaveLength(1)
      expect(receivedPayload[0]).toBe(validFile)
    })

    it('handles onSubmitCallback rejection gracefully', async () => {
      const mockCallback = vi.fn().mockRejectedValue(new Error('Upload failed'))
      const wrapper = getMountFilesUpload({ ...props, onSubmitCallback: mockCallback })

      await capturedOnDrop?.([createFile('test.png', 1)])
      await nextTick()

      testOn.notExistElement({ wrapper, testId: DATA_TEST_IDS.LOADING_STATE })
    })
  })

  describe('File dialog onChange handler', () => {
    it('processes files selected via file dialog', async () => {
      const mockCallback = vi.fn().mockResolvedValue(undefined)

      getMountFilesUpload({ ...props, onSubmitCallback: mockCallback })

      const file = createFile('test.png', 1)

      const mockFileList = {
        0: file,
        length: 1,
        * [Symbol.iterator]() { yield file },
      } as unknown as FileList

      capturedOnChange?.(mockFileList)
      await nextTick()

      expect(mockCallback).toHaveBeenCalled()
    })

    it('does nothing when file dialog is closed without selection', async () => {
      const mockCallback = vi.fn()

      getMountFilesUpload({ ...props, onSubmitCallback: mockCallback })

      capturedOnChange?.(null)

      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe('Slots', () => {
    it('renders custom upload-btn slot', () => {
      const wrapper = getMountFilesUpload(props, {
        'upload-btn': '<button data-test-id="custom-upload-btn">Custom Button</button>',
      })

      testOn.existElement({ wrapper, testId: 'custom-upload-btn' })
    })

    it('renders custom content slot', () => {
      const wrapper = getMountFilesUpload(props, {
        content: '<p data-test-id="custom-content">Custom content</p>',
      })

      testOn.existElement({ wrapper, testId: 'custom-content' })
    })

    it('renders custom default slot instead of built-in UI', () => {
      const wrapper = getMountFilesUpload(props, {
        default: '<div data-test-id="custom-default">Custom default slot</div>',
      })

      testOn.existElement({ wrapper, testId: 'custom-default' })
      testOn.notExistElement({ wrapper, testId: DATA_TEST_IDS.UPLOAD_BTN })
    })
  })
})
