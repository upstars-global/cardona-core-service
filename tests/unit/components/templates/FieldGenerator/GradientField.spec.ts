import { describe, expect, it } from 'vitest'
import GradientField from '../../../../../src/components/templates/FieldGenerator/_components/GradientField.vue'
import { GradientBaseField, TextareaBaseField, getInstanceClass } from '../../../../../src/@model/templates/baseField'
import { ColorPreviewState } from '../../../../../src/utils/colorPreview'
import { getSelectorTestId, setMountComponent } from '../../../utils'

const getMountComponent = setMountComponent(GradientField)

const VALID_GRADIENT = 'linear-gradient(to right, #15010A 0%,#560015 50%,#610B0B 100%)'

const createField = () => new GradientBaseField({
  key: 'backgroundColor',
  label: 'Gradient options',
})

const getSwatch = wrapper => wrapper.find(getSelectorTestId('color-preview-swatch'))

describe('GradientBaseField', () => {
  it('reuses TextareaBaseField behaviour (rows default, transformField)', () => {
    const field = createField()

    expect(field).toBeInstanceOf(TextareaBaseField)
    expect(field.rows).toBe(4)

    field.value = VALID_GRADIENT
    expect(field.transformField()).toBe(VALID_GRADIENT)
  })

  // GradientBaseField must be checked before TextareaBaseField in getInstanceClass' lookup order,
  // the same way DummySelectBaseField is checked before SelectBaseField
  it('resolves to itself, not the TextareaBaseField parent, via getInstanceClass', () => {
    expect(getInstanceClass(createField())).toBe(GradientBaseField)
  })
})

describe('GradientField', () => {
  it('renders a valid gradient in the preview', () => {
    const wrapper = getMountComponent({ modelValue: VALID_GRADIENT, field: createField() })

    expect(getSwatch(wrapper).attributes('data-state')).toBe(ColorPreviewState.Valid)
    expect(getSwatch(wrapper).attributes('style')).toContain('linear-gradient')
  })

  it('shows the empty state when nothing is typed yet', () => {
    const wrapper = getMountComponent({ modelValue: '', field: createField() })

    expect(getSwatch(wrapper).attributes('data-state')).toBe(ColorPreviewState.Empty)
  })

  it('shows the invalid state for a partial gradient without throwing', () => {
    const wrapper = getMountComponent({ modelValue: 'linear', field: createField() })

    expect(getSwatch(wrapper).attributes('data-state')).toBe(ColorPreviewState.Invalid)
    expect(getSwatch(wrapper).attributes('style')).toBeUndefined()
  })

  it('updates the preview in real time', async () => {
    const wrapper = getMountComponent({ modelValue: 'linear', field: createField() })

    await wrapper.setProps({ modelValue: VALID_GRADIENT })

    expect(getSwatch(wrapper).attributes('data-state')).toBe(ColorPreviewState.Valid)
  })

  it('emits the typed value', async () => {
    const wrapper = getMountComponent({ modelValue: '', field: createField() })

    await wrapper.find('textarea').setValue(VALID_GRADIENT)

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([VALID_GRADIENT])
  })
})
