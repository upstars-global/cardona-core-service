import { dayDate, fullDate, fullDateWithSeconds } from '../../@core/utils/date';
import Vue from 'vue';
Vue.directive('day-date', {
    bind(el, binding) {
        el.innerText = dayDate(binding.value);
    },
});
Vue.directive('full-date', {
    bind(el, binding) {
        el.innerText = fullDate(binding.value);
    },
});
Vue.directive('full-date-with-seconds', {
    bind(el, binding) {
        el.innerText = fullDateWithSeconds(binding.value);
    },
});
//# sourceMappingURL=date.js.map