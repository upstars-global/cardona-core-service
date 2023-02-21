<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import { ActionType, ActionVariant } from '@model/action'
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
    const { t } = useI18nUtils()
    const badgeVariant = computed(() => `light-${ActionVariant[props.type]}`)
    const badgeLabel = computed(() => props.type && t(`action.${props.type}`))

    return {
      badgeVariant,
      badgeLabel,
    }
  },
})
</script>
