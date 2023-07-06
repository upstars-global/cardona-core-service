import Vue from 'vue';
import vSelect from 'vue-select';
vSelect.props.components.default = () => ({
    Deselect: {
        render: (h) => h('feather-icon', { props: { size: '14', icon: 'XIcon' } }),
    },
    OpenIndicator: {
        render: (h) => h('feather-icon', {
            props: { size: '15', icon: 'ChevronDownIcon' },
            class: 'open-indicator',
        }),
    },
});
// @ts-ignore
Vue.component('VSelect', vSelect);
//# sourceMappingURL=vue-select.js.map