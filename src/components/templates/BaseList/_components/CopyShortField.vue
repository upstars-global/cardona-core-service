<script lang="ts">
import CopyField from './CopyField.vue'
import { computed } from 'vue'
import { getShortString } from '../../../../helpers'

export default {
  name: 'CopyShortField',
  extends: CopyField,
  setup(props) {
    const labelValue = computed(() => getShortString(props.value))

    return {
      ...CopyField.setup(props),
      labelValue,
    }
  },
}
</script>