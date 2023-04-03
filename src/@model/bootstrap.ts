export const BSizes = {
  Xs: 'xs',
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
  Xl: 'xl',
} as const

export type BSize = (typeof BSizes)[keyof typeof BSizes]

export const BVariants = {
  Primary: 'primary',
  OutlinePrimary: 'outline-primary',
  Secondary: 'secondary',
  OutlineSecondary: 'outline-secondary',
  Success: 'success',
  OutlineSuccess: 'outline-success',
  Warning: 'warning',
  Danger: 'danger',
  OutlineDanger: 'outline-danger',
  Info: 'info',
} as const

export type BVariant = (typeof BVariants)[keyof typeof BVariants]
