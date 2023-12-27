import vSelect from 'vue-select'
import {App} from "vue/dist/vue";

vSelect.props.components.default = () => ({
    Deselect: {
        render() {
            return h('i', {
                class: 'v-icon notranslate v-theme--light v-icon--size-default ml-25 tabler-x v-icon notranslate v-theme--light v-icon--size-default'
            });
        }
    },
});


export default function (app: App) {
    app.component('VueSelect', vSelect)
}
