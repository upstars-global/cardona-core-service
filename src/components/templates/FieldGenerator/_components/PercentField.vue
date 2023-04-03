<script lang="ts">
import NumberField from './NumberField.vue'

export default {
  name: 'PercentField',
  extends: NumberField,

  setup(props, context) {
    const appendText: string = '%'

    return {
      ...NumberField.setup(props, context),
      appendText,
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../../../../@core/scss/base/bootstrap-extended/_variables.scss';

.input-group-text {
  font-weight: 600;
}

.error {
  .input-group-text {
    border-color: $red;
  }
}
</style>
