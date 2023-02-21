export class LocaleInfo {
  readonly code: string
  readonly name: string
  readonly label: string

  constructor(code: string, name: string) {
    this.code = code
    this.name = name
    this.label = `${name} - ${code}`
  }
}
