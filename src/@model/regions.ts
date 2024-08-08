export class RegionInfo {
  readonly label: string

  constructor(
    readonly code: string,
    readonly name: string,
    readonly countryName: string,
    readonly countryCode: string,
  ) {
    this.label = countryName ? `${name} (${countryName}) - ${code}` : `${name} - ${code}`
  }
}

export interface RegionsResponseData {
  readonly [code: string]: string
}

export interface RegionsRequestFilter {
  readonly countryCodes: Array<string>
}
