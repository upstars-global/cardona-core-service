import { getCurrentInstance } from 'vue';
import i18n from '../libs/i18n';
export const useBvModal = () => {
    const vm = getCurrentInstance().proxy;
    return vm.$bvModal;
};
export var ConfirmModal;
(function (ConfirmModal) {
    ConfirmModal["Add"] = "Add";
    ConfirmModal["Delete"] = "Delete";
})(ConfirmModal || (ConfirmModal = {}));
var okVariants;
(function (okVariants) {
    okVariants["Add"] = "success";
    okVariants["Delete"] = "danger";
})(okVariants || (okVariants = {}));
var okTitles;
(function (okTitles) {
    okTitles["Add"] = "action.add";
    okTitles["Delete"] = "action.remove";
})(okTitles || (okTitles = {}));
export const useModal = () => {
    const { proxy } = getCurrentInstance();
    // Confirmation modal
    const confirmationModal = (localeKey = 'default', type = ConfirmModal.Delete) => {
        return proxy.$bvModal.msgBoxConfirm(i18n.t(`modal.${localeKey}.description`), {
            title: i18n.t(`modal.${localeKey}.title`),
            size: 'sm',
            okVariant: okVariants[type],
            okTitle: i18n.t(okTitles[type]),
            cancelVariant: 'outline-secondary',
            cancelTitle: i18n.t('action.cancel'),
            hideHeaderClose: false,
            centered: true,
        });
    };
    return {
        confirmationModal,
    };
};
//# sourceMappingURL=bvModal.js.map