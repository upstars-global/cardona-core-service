import { IRequestListPayload } from '@model/index'
import { UserSmallInfo } from './user'

interface ProjectIntegrationsInput {
  readonly marbella: boolean
  readonly vCoins: boolean
  readonly valencia: boolean
}
export interface ProjectInfoInput {
  readonly id: number
  readonly name: string
  readonly publicName: string
  readonly alias: string
  readonly users: UserSmallInfo[]
  readonly websiteUrl: string
  readonly integrations?: ProjectIntegrationsInput | null
  readonly iconPath?: string | null
  readonly mainLocale?: string
  readonly locales?: Array<string>
}

interface ProjectListFilter {
  search: string
}
export interface ProjectListInput extends IRequestListPayload {
  readonly filter?: ProjectListFilter
}

export class ProjectInfo {
  readonly id: number
  readonly name: string
  readonly publicName: string
  readonly alias: string
  readonly websiteUrl: string
  readonly users: UserSmallInfo[]
  readonly integrations?: ProjectIntegrationsInput | null
  readonly iconPath?: string | null
  readonly originProject?: object
  readonly mainLocale?: string
  readonly locales?: Array<string>

  constructor(project: ProjectInfoInput) {
    this.id = Number(project.id)
    this.name = project.name
    this.publicName = project.publicName
    this.users = project.users
    this.alias = project.alias
    this.websiteUrl = project.websiteUrl
    this.integrations = project.integrations ? project.integrations : null
    this.iconPath = project.iconPath || null
    this.originProject = project
    this.mainLocale = project.mainLocale
    this.locales = project.locales
  }
}

export interface ProjectOriginInput {
  readonly id?: number
  readonly name: string
  readonly publicName: string
  readonly alias: string
  readonly majorApiVer: number | null
  readonly websiteUrl: string
  readonly clientId: string
  readonly privateKey: string
  readonly callbackUrl: string
  readonly url: string
  readonly wlIdentifier: string
  readonly alaroConfigName: string
  readonly marbellaUrl: string
  readonly marbellaPublicKey: string
  readonly marbellaPrivateKey: string
  readonly valenciaMerchantName: string
  readonly vcoinsUrl: string
  imagePath: string
  readonly users?: Array<UserSmallInfo>
  readonly mainLocale: string
  readonly locales: Array<string>
}

export class ProjectOriginData implements ProjectOriginInput {
  //TODO: Думаю можно будет удалить, когда будем переводить на базовый раздел
  readonly id?: number
  readonly name: string
  readonly publicName: string
  readonly alias: string
  readonly majorApiVer: number | null
  readonly websiteUrl: string
  readonly clientId: string
  readonly privateKey: string
  readonly callbackUrl: string
  readonly url: string
  readonly wlIdentifier: string
  readonly alaroConfigName: string
  readonly marbellaUrl: string
  readonly marbellaPublicKey: string
  readonly marbellaPrivateKey: string
  readonly valenciaMerchantName: string
  readonly vcoinsUrl: string
  readonly imagePath: string
  readonly users?: Array<UserSmallInfo>
  readonly mainLocale: string
  readonly locales: Array<string>

  constructor(data?: ProjectOriginInput) {
    if (data?.id) this.id = data.id
    this.name = data?.name || ''
    this.publicName = data?.publicName || ''
    this.alias = data?.alias || ''
    this.majorApiVer = data?.majorApiVer || null
    this.websiteUrl = data?.websiteUrl || ''
    this.clientId = data?.clientId || ''
    this.privateKey = data?.privateKey || ''
    this.callbackUrl = data?.callbackUrl || ''
    this.url = data?.url || ''
    this.wlIdentifier = data?.wlIdentifier || ''
    this.alaroConfigName = data?.alaroConfigName || ''
    this.marbellaUrl = data?.marbellaUrl || ''
    this.marbellaPublicKey = data?.marbellaPublicKey || ''
    this.marbellaPrivateKey = data?.marbellaPrivateKey || ''
    this.valenciaMerchantName = data?.valenciaMerchantName || ''
    this.vcoinsUrl = data?.vcoinsUrl || ''
    this.imagePath = data?.imagePath || ''
    this.users = data?.users || []
    this.mainLocale = data?.mainLocale || ''
    this.locales = data?.locales || []
  }
}

interface ProjectSubmissionInput extends ProjectOriginInput {
  readonly userIds: Array<number> | Array<void>
}

export class ProjectSubmissionData extends ProjectOriginData implements ProjectSubmissionInput {
  readonly userIds: Array<number> | Array<void>

  constructor(data: ProjectOriginInput) {
    super(data)

    this.userIds = data.users?.map(({ id }) => id) || []
  }
}
