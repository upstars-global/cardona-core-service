<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { TableField } from '../../../../@model/templates/tableFields'
import { getListStorage, setStorage } from '@/helpers/storage'
import { VColors, VVariants } from '@/@model/vuetify'
import { IconsList } from '@/@model/enums/icons'

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
  const list = getListStorage(TableField)(keyStorage)

  if (list.isNotEmpty)
    emits('update:modelValue', list)
})
</script>

<template>
  <VBtn
    :variant="VVariants.Text"
    :color="VColors.Secondary"
    density="compact"
    icon
  >
    <VIcon :icon="IconsList.SettingsIcon" />
    <VMenu
      activator="parent"
      :close-on-content-click="false"
    >
      <VList>
        <VListItem
          v-for="item in filledList"
          :key="item.key"
          @click="onToggleActive(item)"
        >
          <template #prepend>
            <VIcon
              v-if="selectedKeys.includes(item.key)"
              icon="tabler-check"
            />
          </template>
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </VBtn>
</template>
