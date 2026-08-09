export enum ColorPreviewState {
  Empty = 'empty',
  Invalid = 'invalid',
  Valid = 'valid',
}

export type ColorPreviewProperty = 'background-color' | 'background-image'

const HEX_COLOR_REGEX = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i
const GRADIENT_REGEX = /^(?:repeating-)?(?:linear|radial|conic)-gradient\(.+\)$/i
const CSS_URL_REGEX = /url\(/i

// Returns undefined when the engine has no CSS.supports (jsdom, older browsers)
const isSupportedByEngine = (property: ColorPreviewProperty, value: string): boolean | undefined => {
  try {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function')
      return CSS.supports(property, value)
  }
  catch {
    // Malformed input can throw in some engines — fall back to the regex check
  }

  return undefined
}

const isValidColor = (value: string): boolean =>
  isSupportedByEngine('background-color', value) ?? HEX_COLOR_REGEX.test(value)

// Only gradients are considered valid here: the field is a gradient field, and rejecting url()
// keeps the preview from fetching remote resources while the value is being typed
const isValidGradient = (value: string): boolean =>
  GRADIENT_REGEX.test(value)
  && !CSS_URL_REGEX.test(value)
  && (isSupportedByEngine('background-image', value) ?? true)

export const isSupportedCssValue = (property: ColorPreviewProperty, value: string): boolean =>
  property === 'background-color' ? isValidColor(value) : isValidGradient(value)

export const getColorPreviewState = (
  value: string | undefined,
  property: ColorPreviewProperty,
): ColorPreviewState => {
  const trimmedValue = value?.trim()

  if (!trimmedValue)
    return ColorPreviewState.Empty

  return isSupportedCssValue(property, trimmedValue) ? ColorPreviewState.Valid : ColorPreviewState.Invalid
}
