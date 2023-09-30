export class LocaleOption {
  readonly id: string
  readonly name: string

  constructor(code: string, name: string) {
    this.id = code
    this.name = `${name} - ${code}`
  }
}
