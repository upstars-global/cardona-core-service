<script lang="ts">
import NameWithIdField from './NameWithIdField.vue'
import { computed } from 'vue'
import { getShortString } from '../../../../helpers'

export default {
  name: 'NameWithShortIdField',
  extends: NameWithIdField,
  setup(props) {
    const itemId = computed(() => getShortString(props.item.id))

    return {
      ...NameWithIdField.setup(props),
      itemId,
    }
  },
}
</script>