export const BSizes = {
  Xs: 'xs',
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
  Xl: 'xl',
} as const

export type BSize = (typeof BSizes)[keyof typeof BSizes]

export enum BColors {
  Primary = 'primary',
  Secondary = 'secondary',
  Success = 'success',
  Warning = 'warning',
  Danger = 'danger',
  Info = 'info',
}

export enum BLightColors {
  LightPrimary = `light-primary`,
  LightSecondary = `light-secondary`,
  LightSuccess = `light-success`,
  LightWarning = `light-warning`,
  LightDanger = `light-danger`,
  LightInfo = `light-info`,
}

export const BVariants = {
  ...BColors,
  OutlinePrimary: `outline-${BColors.Primary}`,
  OutlineSecondary: `outline-${BColors.Secondary}`,
  OutlineSuccess: `outline-${BColors.Success}`,
  OutlineDanger: `outline-${BColors.Danger}`,
} as const

export type BVariant = (typeof BVariants)[keyof typeof BVariants]
