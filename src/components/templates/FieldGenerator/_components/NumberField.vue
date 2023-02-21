<script lang="ts">
import TextField from './TextField.vue'

export default {
  name: 'NumberField',
  extends: TextField,

  setup(props, context) {
    const inputType: string = 'number'

    return {
      ...TextField.setup(props, context),
      inputType,
    }
  },
}
</script>
