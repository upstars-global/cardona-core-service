<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { debounce } from 'lodash'
import FieldGenerator from '../components/templates/FieldGenerator/index.vue'
import type { NumberOrString } from '../@model'
import { IconsList } from '../@model/enums/icons'
import { BaseField, SelectBaseField } from '../@model/templates/baseField'
import { VColors, VSizes, VVariants } from '../@model/vuetify'

type DynamicField = BaseField | Record<string, BaseField>

const props = withDefaults(defineProps<{
  modelValue: DynamicField[]
  templateField: Function
  disabled?: boolean
  disabledAddBtn?: boolean
  required?: boolean
  allowAddWithEmpty?: boolean
  hideLabelOnEmptyList?: boolean
  fieldCol?: number | string
}>(),
{
  fieldCol: 4,
  hideLabelOnEmptyList: true,
  required: false,
})

const emits = defineEmits<{
  (event: 'update:model-value', value: Record<string, string>): void
  (event: 'on-add-item', value: Record<string, string>): void
}>()

const rows = computed({
  get: () => props.modelValue,
  set: value => {
    emits('update:model-value', value)
  },
})

const isSelectItemNotEmpty = computed(() => {
  if (
    props.modelValue?.[0]
    && Object.values(props.modelValue[0])?.[0]
    && isBaseField(Object.values(props.modelValue[0])?.[0])
  )
    return isSelect(Object.values(props.modelValue[0])[0]) && !filteredOptions.value.length

  return false
})

const isDisabled = computed(() => {
  return props.modelValue?.some((row: DynamicField): boolean => {
    if (isBaseField(row))
      return !row.value
    else
      return !Object.values(row)?.[0].value
  })
})

const isBaseField = (field: object): boolean => field instanceof BaseField

const isSelect = (field: object): boolean => field instanceof SelectBaseField

// Options
const filteredOptions = computed<Array<any>>(() => {
  const selectedIds: Array<string> = rows.value
    .map((row: DynamicField) => {
      if (isSelect(row)) {
        return row.value.id
      }
      else {
        const selectField = Object.values(row).find((field: BaseField) =>
          isSelect(field),
        )

        return selectField?.value?.id
      }
    })
    .filter(item => !!item)

  return selectField.value && selectField.value.options
    ? selectField.value.options.filter((option: any) => !selectedIds.includes(option?.id))
    : []
})

// Search
const selectField: any = ref()

const fetchStartSelect = async rows => {
  const [row]: Array<BaseField> = rows

  if (row) {
    const selectFieldItem = Object.values(row).find(field => field?.fetchOptionsActionName)

    if (selectFieldItem) {
      selectField.value = selectFieldItem

      await selectField.value.fetchOptions()
    }
  }
}

onMounted(async () => {
  await fetchStartSelect([props.templateField()])
})

const fetchSelectOptions = debounce(async (search = '') => {
  await selectField.value.fetchOptions(search)
}, 250)

// Handlers
const onAdd = async () => {
  const itemTemplate: any = props.templateField()

  rows.value.push(itemTemplate)
  emits('on-add-item', { item: itemTemplate, index: rows.value.length - 1 })
}

const onRemove = (index: NumberOrString) => !props.disabled && rows.value.splice(index, 1)

const disableAddFiled = computed(() =>
  [
    props.disabled,
    !props.allowAddWithEmpty && isDisabled.value,
    isSelectItemNotEmpty.value,
    props.disabledAddBtn,
  ].some(Boolean),
)
</script>

<template>
  <div>
    <VRow v-if="templateField && !hideLabelOnEmptyList">
      <VCol v-if="isBaseField(templateField)" data-test-id="single-field-label">
        <label>{{ templateField?.label }}</label>
      </VCol>

      <VCol
        v-for="(item, index) in Object.values(templateField)"
        v-else
        :key="index"
        :data-test-id="`label-${index}`"
      >
        <template v-if="!rows.length">
          <label v-show="!index">{{ item?.label }}</label>
        </template>
      </VCol>

      <VCol md="1" />
    </VRow>

    <VRow
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      class="filed-list__item"
    >
      <VCol
        v-if="isBaseField(row)"
        class="py-0"
      >
        <slot
          :field="rows[rowIndex]"
          :index="rowIndex"
        >
          <FieldGenerator
            v-model="rows[rowIndex]"
            :options="filteredOptions"
            :with-info="false"
            :disabled="disabled"
            @search="fetchSelectOptions"
            :data-test-id="`single-field-${rowIndex}`"
          />
        </slot>
      </VCol>

      <VCol
        v-for="(fieldInfo, key, idx) in row"
        v-else
        :key="idx"
        class="py-0"
        :data-test-id="`row-${rowIndex}-col-${idx}`"
        :md="fieldCol"
      >
        <slot
          :key="key"
          :name="`field-${key}`"
          :row-index="rowIndex"
          :field="rows[rowIndex][key]"
        >
          <FieldGenerator
            v-model="rows[rowIndex][key]"
            :options="filteredOptions"
            :disabled="disabled"
            :with-info="false"
            @search="fetchSelectOptions"
            :data-test-id="`field-${rowIndex}-${key}`"
          />
        </slot>
      </VCol>

      <VCol
        v-if="!disabled"
        md="1"
        class="d-flex justify-start align-self-start remove-field__wrapper py-0"
      >
        <VBtn
          v-if="rowIndex || !required"
          :variant="VVariants.Outlined"
          :color="VColors.Error"
          class="filed-list__delete pa-0"
          :class="{ 'cursor-default': disabled }"
          :disabled="disabled"
          @click="onRemove(rowIndex)"
          :data-test-id="`button-remove-${rowIndex}`"
        >
          <VIcon :icon="IconsList.Trash2Icon" />
        </VBtn>
      </VCol>
    </VRow>

    <VBtn
      v-if="!disabled"
      :size="VSizes.Small"
      :variant="VVariants.Outlined"
      :color="VColors.Secondary"
      class="mt-50"
      :disabled="disableAddFiled"
      @click="onAdd"
      data-test-id="button-add"
    >
      <VIcon :icon="IconsList.PlusIcon" />

      <span class="text-nowrap"> {{ $t('action.add') }} </span>
    </VBtn>
  </div>
</template>

<style lang="scss" scoped>
.filed-list__item:not(:last-child) {
  margin-bottom: 1.125rem;
}

.filed-list__delete {
  margin-top: 1.65rem;
  min-width: 2.5rem;
  height: 2.5rem;
}
</style>
