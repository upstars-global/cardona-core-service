import { describe, expect, it } from 'vitest'
import ColorField from '../../../../../src/components/templates/FieldGenerator/_components/ColorField.vue'
import { ColorBaseField } from '../../../../../src/@model/templates/baseField'
import { ColorPreviewState } from '../../../../../src/utils/colorPreview'
import { getSelectorTestId, setMountComponent } from '../../../utils'

const getMountComponent = setMountComponent(ColorField)

const createField = () => new ColorBaseField({
  key: 'backgroundColor',
  label: 'Background color',
  placeholder: 'FFFFFF',
})

const getSwatch = wrapper => wrapper.find(getSelectorTestId('color-preview-swatch'))

describe('ColorField', () => {
  it('prefixes the stored value with "#" for the preview', () => {
    const wrapper = getMountComponent({ modelValue: 'DB1CF1', field: createField(), disabled: false })

    expect(getSwatch(wrapper).attributes('data-state')).toBe(ColorPreviewState.Valid)
    expect(getSwatch(wrapper).attributes('style')).toContain('background-color: rgb(219, 28, 241)')
  })

  it('shows the empty state when nothing is typed yet', () => {
    const wrapper = getMountComponent({ modelValue: '', field: createField(), disabled: false })

    expect(getSwatch(wrapper).attributes('data-state')).toBe(ColorPreviewState.Empty)
  })

  it('shows the invalid state for a broken hex without throwing', () => {
    const wrapper = getMountComponent({ modelValue: '1', field: createField(), disabled: false })

    expect(getSwatch(wrapper).attributes('data-state')).toBe(ColorPreviewState.Invalid)
  })

  it('updates the preview in real time', async () => {
    const wrapper = getMountComponent({ modelValue: '1', field: createField(), disabled: false })

    await wrapper.setProps({ modelValue: 'FFFFFF' })

    expect(getSwatch(wrapper).attributes('data-state')).toBe(ColorPreviewState.Valid)
  })

  it('emits the typed value', async () => {
    const wrapper = getMountComponent({ modelValue: '', field: createField(), disabled: false })

    await wrapper.find('input').setValue('DB1CF1')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['DB1CF1'])
  })
})

describe('ColorBaseField.transformField', () => {
  it('adds the "#" back for the API payload', () => {
    const field = createField()

    field.value = 'DB1CF1'

    expect(field.transformField()).toBe('#DB1CF1')
  })

  it('returns a bare "#" when the value has not been filled in yet', () => {
    const field = createField()

    expect(field.transformField()).toBe('#')
  })
})
