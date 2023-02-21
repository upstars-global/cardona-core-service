<template>
  <b-form-tags
    v-model="modelValue"
    separator=" "
    :placeholder="field.placeholder"
    :disabled="disabled"
    :state="errors.isNotEmpty ? false : null"
    class="tags-field"
    :duplicate-tag-text="$t('component.tags.duplicateTag')"
  />
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue'
import { FieldInfo } from '@model/field'

export default defineComponent({
  name: 'TagsField',
  props: {
    value: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },

    field: {
      type: Object as PropType<FieldInfo>,
      required: true,
    },

    errors: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const modelValue = computed({
      get: () => props.value,
      set: (value) => emit('input', value),
    })

    return { modelValue }
  },
})
</script>

<style lang="scss" scoped>
@import '~@core/scss/base/bootstrap-extended/_variables.scss';
@import '@/assets/scss/style.scss';

.tags-field::v-deep {
  .b-form-tag {
    background-color: $bg-light-purple;
    color: $purple;
    font-weight: $font-weight-bold;
    font-size: 0.9rem;
  }

  .b-form-tags-button {
    display: none;
  }
}
</style>
