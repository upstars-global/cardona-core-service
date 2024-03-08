<script lang="ts">
import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ActionType } from '../../../../../@model/enums/action'
import { ActionVariant } from '../../../../../@model/enums/action'
import StatementField from './StatementField.vue'

export default defineComponent({
  name: 'ActionField',
  extends: StatementField,

  props: {
    type: {
      type: String as PropType<ActionType>,
      default: '',
    },
  },

  setup(props) {
    const { t } = useI18n()
    const badgeVariant = computed(() => `light-${ActionVariant[props.type]}`)
    const badgeLabel = computed(() => props.type && t(`action.${props.type}`))

    return {
      badgeVariant,
      badgeLabel,
    }
  },
})
</script>
