<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { TableField } from '../../../../@model/templates/tableFields'
import { getListStorage, setStorage } from '../../../../helpers/storage'
import { VColors, VVariants } from '../../../../@model/vuetify'
import { IconsList } from '../../../../@model/enums/icons'
import { IS_TEST_ENV } from '../../../../utils/constants'

const props = defineProps<{
  entityName: string
  list: TableField[]
  modelValue: TableField[]
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', data: TableField[]): void
}>()

const route = useRoute()
const keyStorage = `${route.name?.toString()}-${props.entityName}-list-fields`
const filledList = computed(() => props.list.filter(item => item.title.isNotEmpty))
const selectedKeys = computed(() => props.modelValue.map(item => item.key))
const allTableKeys = computed(() => props.list.map(({ key }) => key))

const getTableListAfterToggle = (hasKey: boolean, data: TableField) => {
  return hasKey ? props.modelValue.filter(item => item.key !== data.key) : [...props.modelValue, data]
}

const sortByDefaultTableFields = (tableList: TableField[]) =>
  allTableKeys.value.reduce<TableField[]>((acc, key) => {
    const tableField = tableList.find(item => item.key === key)

    return tableField ? [...acc, tableField] : acc
  }, [])

const onToggleActive = (data: TableField) => {
  const tableList = getTableListAfterToggle(selectedKeys.value.includes(data.key), data)
  const selectedTableList = sortByDefaultTableFields(tableList)

  setStorage(keyStorage, selectedTableList)
  emits('update:modelValue', selectedTableList)
}

onMounted(() => {
  /// TODO make save only keys but not all fields' data
  const list = getListStorage(TableField)(keyStorage)

  if (list.isNotEmpty)
    emits('update:modelValue', list)
})
</script>

<template>
  <VMenu :attach="IS_TEST_ENV">
    <template #activator="{ props }">
      <VBtn
        :variant="VVariants.Text"
        :color="VColors.Secondary"
        v-bind="props"
        data-test-id="activator"
        class="pl-2 pr-3"
        max-height="32"
      >
        <VIcon
          class="mr-2"
          :icon="IconsList.LayoutColumns"
          size="20"
        />

        <span class="text-secondary text-body-2 font-weight-medium">
          {{ $t('common.columns') }}
        </span>
      </VBtn>
    </template>
    <VList>
      <VListItem
        v-for="item in filledList"
        :key="item.key"
        :data-test-id="`select-item-${item.key}`"
        :disabled="item.alwaysVisible"
        @click="onToggleActive(item)"
      >
        <template #append>
          <VIcon
            v-if="selectedKeys.includes(item.key)"
            :icon="item.alwaysVisible ? IconsList.LockIcon : IconsList.CheckIcon"
            data-test-id="check-icon"
          />
        </template>
        <VListItemTitle
          class="text-color-base"
          data-test-id="title"
        >
          {{ item.title }}
        </VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>
