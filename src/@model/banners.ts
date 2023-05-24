import i18n from '../libs/i18n'
import { OptionsItem } from '../@model/index'

export enum BannerTypes {
  Slider = 'slider',
  Promo = 'promo',
}

export const typesOptions: Array<OptionsItem> = [
  { id: BannerTypes.Slider, name: i18n.t('page.banners.slider') as string },
  { id: BannerTypes.Promo, name: i18n.t('page.banners.promo') as string },
]
