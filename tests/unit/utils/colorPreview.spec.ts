import { afterEach, describe, expect, it, vi } from 'vitest'
import { ColorPreviewState, getColorPreviewState, isSupportedCssValue } from '../../../src/utils/colorPreview'

const VALID_GRADIENT = 'linear-gradient(to right, #15010A 0%,#560015 50%,#610B0B 100%)'

// jsdom ships no CSS.supports, so these specs also cover the regex fallback path
const withCssSupports = (impl: (property: string, value: string) => boolean) => {
  vi.stubGlobal('CSS', { supports: impl })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getColorPreviewState', () => {
  it.each([undefined, '', '   '])('returns Empty for %p', value => {
    expect(getColorPreviewState(value, 'background-color')).toBe(ColorPreviewState.Empty)
    expect(getColorPreviewState(value, 'background-image')).toBe(ColorPreviewState.Empty)
  })

  it.each(['#FFF', '#FFFF', '#DB1CF1', '#DB1CF180'])('treats %s as a valid color', value => {
    expect(getColorPreviewState(value, 'background-color')).toBe(ColorPreviewState.Valid)
  })

  it.each(['#', '#1', 'DB1CF1', 'not a color'])('treats %p as an invalid color', value => {
    expect(getColorPreviewState(value, 'background-color')).toBe(ColorPreviewState.Invalid)
  })

  it.each([
    VALID_GRADIENT,
    'radial-gradient(circle, #fff 0%, #000 100%)',
    'repeating-linear-gradient(45deg, #fff 0 10px, #000 10px 20px)',
    'conic-gradient(#fff, #000)',
  ])('treats %s as a valid gradient', value => {
    expect(getColorPreviewState(value, 'background-image')).toBe(ColorPreviewState.Valid)
  })

  it.each(['linear', 'linear-gradient(', '#DB1CF1', 'url(https://example.com/a.png)'])(
    'treats %p as an invalid gradient',
    value => {
      expect(getColorPreviewState(value, 'background-image')).toBe(ColorPreviewState.Invalid)
    },
  )

  it('trims the value before validating', () => {
    expect(getColorPreviewState('  #DB1CF1  ', 'background-color')).toBe(ColorPreviewState.Valid)
  })
})

describe('isSupportedCssValue', () => {
  it('delegates colors to CSS.supports when the engine provides it', () => {
    withCssSupports(() => true)

    // rgb() is rejected by the fallback regex, so a Valid result proves CSS.supports was used
    expect(isSupportedCssValue('background-color', 'rgb(1, 2, 3)')).toBe(true)
  })

  it('falls back to the regex when CSS.supports throws', () => {
    withCssSupports(() => {
      throw new Error('malformed value')
    })

    expect(isSupportedCssValue('background-color', '#DB1CF1')).toBe(true)
    expect(isSupportedCssValue('background-color', 'rgb(1, 2, 3)')).toBe(false)
  })

  it('keeps rejecting non-gradients even when the engine accepts them', () => {
    withCssSupports(() => true)

    expect(isSupportedCssValue('background-image', 'url(https://example.com/a.png)')).toBe(false)
    expect(isSupportedCssValue('background-image', VALID_GRADIENT)).toBe(true)
  })

  it('rejects a gradient the engine cannot parse', () => {
    withCssSupports(() => false)

    expect(isSupportedCssValue('background-image', 'linear-gradient(nonsense)')).toBe(false)
  })
})
