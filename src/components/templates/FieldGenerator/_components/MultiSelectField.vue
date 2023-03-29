<script lang="ts">
import { PropType, computed } from 'vue'
import SelectField from './SelectField.vue'
import { FieldInfo } from '../../../../@model/field'

export default {
  name: 'MultiSelectField',
  extends: SelectField,

  props: {
    value: {
      type: Array as PropType<Array<any>>,
      required: true,
    },

    field: {
      type: Object as PropType<FieldInfo>,
      required: true,
    },
  },

  setup(props, context) {
    const isMultiple = true

    // Options
    const options = computed(() =>
      props.field.options
        ? props.field.options.filter((option: any) =>
            props.value.every((item) => item.id !== option.id)
          )
        : []
    )

    return {
      ...SelectField.setup(props, context),
      isMultiple,
      options,
    }
  },
}
</script>
