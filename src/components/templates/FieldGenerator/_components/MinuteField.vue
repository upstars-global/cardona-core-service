<script lang="ts">
import NumberField from './NumberField.vue'

export default {
  name: 'MinuteField',
  extends: NumberField,

  setup(props, context) {
    const appendText: string = 'min'

    return {
      ...NumberField.setup(props, context),
      appendText,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.error {
  .input-group-text {
    border-color: $red;
  }
}
</style>
