import i18n from '../libs/i18n';
export var BannerTypes;
(function (BannerTypes) {
    BannerTypes["Slider"] = "slider";
    BannerTypes["Promo"] = "promo";
})(BannerTypes || (BannerTypes = {}));
export const typesOptions = [
    { id: BannerTypes.Slider, name: i18n.t('page.banners.slider') },
    { id: BannerTypes.Promo, name: i18n.t('page.banners.promo') },
];
//# sourceMappingURL=banners.js.map