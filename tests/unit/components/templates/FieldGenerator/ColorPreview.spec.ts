import { describe, expect, it } from 'vitest'
import ColorPreview from '../../../../../src/components/templates/FieldGenerator/_components/_partials/ColorPreview.vue'
import { VSizes } from '../../../../../src/@model/vuetify'
import { ColorPreviewState } from '../../../../../src/utils/colorPreview'
import { setMountComponent } from '../../../utils'

const getMountComponent = setMountComponent(ColorPreview)

const VALID_GRADIENT = 'linear-gradient(to right, #15010A 0%,#560015 50%,#610B0B 100%)'

describe('ColorPreview', () => {
  it('paints a valid color', () => {
    const wrapper = getMountComponent({ value: '#DB1CF1', property: 'background-color' })

    expect(wrapper.attributes('data-state')).toBe(ColorPreviewState.Valid)
    expect(wrapper.attributes('style')).toContain('background-color: rgb(219, 28, 241)')
  })

  it('paints a valid gradient', () => {
    const wrapper = getMountComponent({ value: VALID_GRADIENT, property: 'background-image' })

    expect(wrapper.attributes('data-state')).toBe(ColorPreviewState.Valid)
    expect(wrapper.attributes('style')).toContain('linear-gradient')
  })

  it('shows the empty state without inline style', () => {
    const wrapper = getMountComponent({ value: '', property: 'background-color' })

    expect(wrapper.attributes('data-state')).toBe(ColorPreviewState.Empty)
    expect(wrapper.attributes('style')).toBeUndefined()
    expect(wrapper.classes()).toContain('color-preview-swatch--empty')
  })

  it('does not put an invalid value into the style attribute', () => {
    const wrapper = getMountComponent({ value: 'javascript:alert(1)', property: 'background-color' })

    expect(wrapper.attributes('data-state')).toBe(ColorPreviewState.Invalid)
    expect(wrapper.attributes('style')).toBeUndefined()
    expect(wrapper.classes()).toContain('color-preview-swatch--invalid')
  })

  it('reacts to a value change without throwing', async () => {
    const wrapper = getMountComponent({ value: 'nonsense', property: 'background-image' })

    expect(wrapper.attributes('data-state')).toBe(ColorPreviewState.Invalid)

    await wrapper.setProps({ value: VALID_GRADIENT })

    expect(wrapper.attributes('data-state')).toBe(ColorPreviewState.Valid)
  })

  it('applies the requested size modifier', () => {
    expect(getMountComponent({ value: '', property: 'background-image', size: VSizes.Large }).classes())
      .toContain('color-preview-swatch--large')

    expect(getMountComponent({ value: '', property: 'background-color' }).classes())
      .toContain('color-preview-swatch--small')
  })
})
