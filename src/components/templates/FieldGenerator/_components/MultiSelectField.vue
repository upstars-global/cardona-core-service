<script lang="ts">
import { PropType, computed } from 'vue'
import SelectField from './SelectField.vue'
import { FieldInfo } from '../../../../@model/field'
import { OptionsItem } from '../../../../@model'

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

    const valueModel = computed<OptionsItem[]>({
      get: () =>
        props.value.map((item) =>
          typeof item === 'string' || typeof item === 'number'
            ? props.field.options?.find((option: OptionsItem) => option.id == item)
            : item
        ),

      set: (item: OptionsItem[]) => context.emit('input', item),
    })

    // Options
    const options = computed(() =>
      props.field.options
        ? props.field.options.filter((option: any) =>
            valueModel.value.every((item) => item.id !== option.id)
          )
        : []
    )

    return {
      ...SelectField.setup(props, context),
      isMultiple,
      options,
      valueModel,
    }
  },
}
</script>
