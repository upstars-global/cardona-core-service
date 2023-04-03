<template>
  <b-dropdown class="d-flex" variant="link" no-caret toggle-class="p-0" right>
    <template #button-content>
      <b-button variant="flat-dark" class="btn-icon">
        <feather-icon icon="SettingsIcon" size="21" />
      </b-button>
    </template>

    <b-dropdown-item v-for="item in filledList" :key="item.key" @click="onToggleActive(item)">
      <div class="d-flex justify-content-between align-items-center">
        <span class="align-middle ml-50">{{ item.label }}</span>
        <feather-icon v-if="selectedKeys.includes(item.key)" icon="CheckIcon" size="16" />
      </div>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType } from 'vue'
import { BButton, BDropdown, BDropdownItem } from 'bootstrap-vue'
import { TableField } from './model'
import { getListStorage, setStorage } from '../../../helpers/storage'
import { useRouter } from '../../../@core/utils/utils'

export default defineComponent({
  components: {
    BButton,
    BDropdown,
    BDropdownItem,
  },
  props: {
    entityName: {
      type: String,
      default: '',
    },
    list: {
      type: Array as PropType<TableField[]>,
      default: () => [],
    },
    value: {
      type: Array as PropType<TableField[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const { route } = useRouter()
    const { name: pageName } = route.value
    const keyStorage: string = `${pageName}-${props.entityName}-list-fields`
    const filledList = computed(() => props.list.filter((item) => item.label.isNotEmpty))
    const selectedKeys = computed(() => props.value.map((item) => item.key))
    const allTableKeys = computed(() => props.list.map(({ key }) => key))

    const getTableListAfterToggle = (hasKey: boolean, data: TableField) => {
      if (hasKey) {
        return props.value.filter((item) => item.key !== data.key)
      } else {
        return [...props.value, data]
      }
    }

    const sortByDefaultTableFields = (tableList: TableField[]) =>
      allTableKeys.value.reduce<TableField[]>((acc, key) => {
        const tableField = tableList.find((item) => item.key === key)

        return tableField ? [...acc, tableField] : acc
      }, [])

    const onToggleActive = (data: TableField) => {
      const tableList = getTableListAfterToggle(selectedKeys.value.includes(data.key), data)
      const selectedTableList = sortByDefaultTableFields(tableList)

      setStorage(keyStorage, selectedTableList)
      emit('input', selectedTableList)
    }

    onMounted(() => {
      const list = getListStorage(TableField)(keyStorage)

      if (list.isNotEmpty) {
        emit('input', list)
      }
    })

    return {
      onToggleActive,

      // Data
      filledList,
      selectedKeys,
    }
  },
})
</script>
