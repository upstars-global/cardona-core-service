interface LoadFileResponse {
  readonly id: string
  readonly path: string
  readonly filename: string
  readonly publicPath: string
}

export class LoadFile implements LoadFileResponse {
  readonly id: string
  readonly path: string
  readonly filename: string
  readonly publicPath: string

  constructor(data: LoadFileResponse) {
    this.id = data.id
    this.path = data.path
    this.filename = data.filename
    this.publicPath = data.publicPath
  }
}
