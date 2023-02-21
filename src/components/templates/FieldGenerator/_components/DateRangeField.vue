<script lang="ts">
import DataTimeField from './DateTimeField.vue'

export default {
  name: 'DateRangeField',
  extends: DataTimeField,

  setup(props, context) {
    const isModeRange = true
    const isStartDateNow = false

    return {
      ...DataTimeField.setup(props, context),
      isModeRange,
      isStartDateNow,
    }
  },
}
</script>
