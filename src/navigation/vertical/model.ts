export type MenuItem = {
  readonly title?: string
  readonly header?: string
  readonly icon?: string
  readonly route?: string
  children?: Array<MenuItem>
  readonly permission?: string
  readonly level?: number
}
