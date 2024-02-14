<template>
  <b-form-group
    v-if="canView"
    :id="`${value.id}-field`"
    class="mb-0"
    :class="formGroupClasses"
    :label-for="value.id"
  >
    <template #label>
      <span>
        {{ groupLabel }}
      </span>

      <feather-icon
        v-if="withInfo && value.info"
        v-b-tooltip.hover.top="infoTitle"
        :icon="IconsList.InfoIcon"
        class="text-muted ml-25 align-text-top"
      />
    </template>

    <template #default>
      <validation-provider
        v-slot="{ errors }"
        :name="value.label"
        :vid="value.id"
        :rules="value.validationRules"
      >
        <component
          :is="value.component"
          :id="value.id"
          v-model="fieldModel"
          :options="options"
          :field="value"
          :errors="errors"
          :disabled="disabled"
          :placeholder="value.placeholder"
          :size="size"
          v-bind="$attrs"
          @search="onSearch"
        />

        <small
          :class="{
            'text-danger': errors.isNotEmpty,
            'check-description': isCheckType && value.description,
          }"
        >
          {{ errors[0] || value.description }}
        </small>
      </validation-provider>
    </template>
  </b-form-group>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import store from '../../../store'
import { BaseField, SwitchBaseField, CheckBaseField } from '../../../@model/baseField'
import { IconsList } from '../../../@model/enums/icons'
import { AlignType } from '../../../@core/components/table-fields/model'

export default defineComponent({
  name: 'FieldGenerator',

  props: {
    value: {
      type: Object as PropType<BaseField>,
      required: true,
    },

    options: {
      type: Array,
      default: () => [],
    },

    withLabel: {
      type: Boolean,
      default: true,
    },

    withInfo: {
      type: Boolean,
      default: true,
    },

    infoAlignText: {
      type: String as PropType<AlignType>,
      default: AlignType.Center,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: 'md',
    },
  },

  emits: ['input', 'search'],

  setup(props, { emit }) {
    const canView = computed<boolean>(() =>
      props.value.permission ? store.getters.abilityCan(props.value.permission, 'view') : true
    )
    const isCheckType = computed(
      () => props.value instanceof SwitchBaseField || props.value instanceof CheckBaseField
    )
    const groupLabel = computed(() =>
      props.withLabel && !isCheckType.value ? props.value.label : ''
    )

    const withInfoClass = computed(() =>
      [isCheckType.value, props.withInfo, props.value.info].every(Boolean)
    )

    const formGroupClasses = computed(() => ({
      'form-required':
        props.withLabel && props.value?.validationRules?.includes('required') && groupLabel.value,
      'with-info': withInfoClass.value,
    }))

    const fieldModel = computed({
      get: () => props.value.value,
      set: (value) => {
        props.value.value = value
        emit('input', props.value)
      },
    })

    const onSearch = (search: string) => emit('search', search)

    const infoTitle = computed(() => ({
      title: `<div class='${`text-${props.infoAlignText}`}'>${props.value.info}</div>`,
      html: true,
    }))

    return {
      canView,
      isCheckType,
      groupLabel,
      formGroupClasses,
      fieldModel,
      infoTitle,
      IconsList,
      onSearch,
    }
  },
})
</script>

<style lang="scss" scoped>
.check-description {
  font-size: 0.75rem;
  padding-left: 1.8rem;
}

.with-info {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: center;
  :deep(label) {
    margin-bottom: initial !important;
    svg {
      margin-left: 0.5rem !important;
      display: block;
    }
  }
}
</style>
