<script lang="ts">
import DateTimeField from './DateTimeField.vue'

export default {
  name: 'DateField',
  extends: DateTimeField,

  setup(props, context) {
    const isStartDateNow = false

    const flatPickrConfig = {
      dateFormat: 'd.m.Y',
    }

    return {
      ...DateTimeField.setup(props, context),
      flatPickrConfig,
      isStartDateNow,
    }
  },
}
</script>
