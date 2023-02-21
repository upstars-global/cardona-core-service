export class RegionInfo {
  readonly label: string

  constructor(readonly code: string, readonly name: string, readonly countryName: string) {
    this.label = countryName ? `${name} (${countryName}) - ${code}` : `${name} - ${code}`
  }
}

export type RegionsResponseData = {
  readonly [code: string]: string
}

export type RegionsRequestFilter = {
  readonly countryCodes: Array<string>
}
