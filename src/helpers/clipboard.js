import Vue from 'vue';
import { useClipboard } from '@vueuse/core';
import ToastificationContent from '../@core/components/toastification/ToastificationContent.vue';
import i18n from '../libs/i18n';
export const copyToClipboard = (value, config = {}) => {
    const { copy } = useClipboard();
    const { withToast = true, title = i18n.t('toast.success.copied') } = config;
    copy(value);
    if (withToast) {
        Vue.$toast({
            component: ToastificationContent,
            props: {
                title,
                icon: 'CopyIcon',
                variant: 'success',
            },
        });
    }
};
//# sourceMappingURL=clipboard.js.map