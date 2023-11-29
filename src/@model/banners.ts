import { i18n } from '../plugins/i18n'
import type { OptionsItem } from './index'

export enum BannerTypes {
  Slider = 'slider',
  Promo = 'promo',
}

export const typesOptions: Array<OptionsItem> = [
  { id: BannerTypes.Slider, name: i18n.t('page.banners.slider') as string },
  { id: BannerTypes.Promo, name: i18n.t('page.banners.promo') as string },
]
