<template>
  <component :is="componentRenderer" :key="componentRendererName" :title="title" is-visible>
    <template v-if="!notHeader" #header>
      <span v-if="title" class="lead collapse-title">{{ title }}</span>
      <div @click.stop>
        <b-form-checkbox v-model="checked" :disabled="checked" switch inline>
          <span class="switch-text cursor-pointer">{{ $t('permission.fullAccess') }}</span>
          <span class="switch-icon-left">
            <feather-icon icon="CheckIcon" />
          </span>
        </b-form-checkbox>
      </div>
    </template>
    <div class="table-box table-permission">
      <b-table-simple v-if="tableItems.length" responsive caption-top>
        <b-thead head-variant="light">
          <b-tr class="header-table">
            <b-th
              v-for="tableColumn in tableColumns"
              :key="tableColumn.key"
              :class="{ 'text-center': tableColumn.key !== 'target' }"
              class="px-2 header-table-th"
            >
              {{ tableColumn.label }}
            </b-th>
          </b-tr>
        </b-thead>
        <b-tbody>
          <b-tr v-for="tableItem in tableItems" :key="tableItem.target">
            <b-td
              v-for="(tableColumn, index) in tableColumns"
              :key="tableColumn.value"
              class="m-0 py-1 px-2"
            >
              <span v-if="index === 0" class="font-weight-bold font-small-4">
                {{ $t(`permission.${tableItem.target}`) }}
              </span>
              <template v-else>
                <div class="d-flex justify-content-center">
                  <b-form-checkbox
                    v-if="!tableItem.notAccessLevel?.includes(Number(tableColumn.key))"
                    :checked="tableItem.access >= tableColumn.key"
                    @change="onChangeCheckboxTable(tableItem, Number(tableColumn.key), $event)"
                  />
                  <span v-else> - </span>
                </div>
              </template>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>

    <div v-if="switchItems.length" class="m-0" :class="{ 'pt-2 border-top': tableItems.length }">
      <b-row
        v-for="(switchItem, index) in switchItems"
        :key="switchItem.target"
        class="mx-0 mb-1 px-2"
        :class="{ 'pb-1 border-bottom': index !== switchItems.length - 1 }"
      >
        <b-form-checkbox
          :checked="switchItem.access > 0"
          switch
          inline
          class="ml-0"
          @change="onChangeCheckbox(switchItem, $event)"
        >
          <span class="ml-1 switch-text cursor-pointer font-weight-bold font-small-4">
            {{ $t(`permission.${switchItem.target}`) }}
          </span>
          <span class="switch-icon-left">
            <feather-icon icon="CheckIcon" />
          </span>
        </b-form-checkbox>
      </b-row>
    </div>
  </component>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { BFormCheckbox } from 'bootstrap-vue'
import { PermissionUpdatableTable } from '../../../@model/permission'
import i18n from '../../../libs/i18n'
import { TranslateResult } from 'vue-i18n'
import AppCollapseItem from '../../../@core/components/app-collapse/AppCollapseItem.vue'

const props = defineProps<{
  title: TranslateResult
  permissions: PermissionUpdatableTable[]
  notHeader?: boolean
  checkedTable?: boolean
}>()
const emit = defineEmits(['update-all-checked', 'change'])

const tableColumns = computed(() => [
  { key: 'target', label: i18n.t('permission.access') },
  { key: '1', label: i18n.t('permission.show') },
  { key: '2', label: i18n.t('permission.add') },
  { key: '3', label: i18n.t('permission.edit') },
  { key: '4', label: i18n.t('permission.delete') },
])

const tableItems = computed(
  () => props.permissions.filter((i) => i.type === 'table') as PermissionUpdatableTable[]
)
const switchItems = computed(
  () => props.permissions.filter((i) => i.type === 'switch') as PermissionUpdatableTable[]
)

const componentRenderer = computed(() => (props.notHeader ? 'div' : AppCollapseItem))
const componentRendererName = computed(() => (props.notHeader ? 'div' : 'AppCollapseItem'))

const searchLevel = (permission: PermissionUpdatableTable, val) => {
  let levelAccessTable = Number(val)
  while (levelAccessTable !== 0 && permission.notAccessLevel?.includes(levelAccessTable)) {
    levelAccessTable--
  }
  return levelAccessTable
}

const getMaxValue = (permission: PermissionUpdatableTable) => {
  switch (permission.type) {
    case 'switch':
      return 1
    case 'table':
      return searchLevel(permission, tableColumns.value[tableColumns.value.length - 1].key)
  }
}

const checkFullAccess = () => {
  const accessAll = props.permissions.every(
    (permission: PermissionUpdatableTable) => permission.access === getMaxValue(permission)
  )
  emit('update-all-checked', accessAll)
  return accessAll
}

const checked = ref(checkFullAccess())

watch(checked, (val) => {
  if (val) {
    props.permissions.forEach((permission) => {
      changeAccess(permission, getMaxValue(permission))
    })
  }
})

watch(
  () => props.checkedTable,
  (val) => {
    if (val) {
      props.permissions.forEach((permission) => {
        changeAccess(permission, getMaxValue(permission))
      })
    }
  }
)

const changeAccess = (permission: PermissionUpdatableTable, access: number) => {
  permission.changeAccess(access)
  emit('change')

  nextTick(() => {
    checked.value = checkFullAccess()
  })
}

const onChangeTrigger = (
  permission: PermissionUpdatableTable,
  level: number = permission.access
) => {
  permission.trigger?.forEach((item) => {
    const isLevelTrigger =
      level === 0 ? level === item.addictionLevelItem : level >= item.addictionLevelItem

    if (isLevelTrigger) {
      let ifAddiction = true
      item.addiction?.forEach((item) => {
        const permissionAddiction = props.permissions?.find((i) => i.target === item.target)
        if (permissionAddiction) {
          const isAccessTrigger =
            item.access === 0 || permissionAddiction.access === 0
              ? permissionAddiction.access !== item.access
              : permissionAddiction.access < item.access
          if (isAccessTrigger) {
            ifAddiction = false
          }
        }
      })

      if (ifAddiction) {
        item.itemActive?.forEach((item) => {
          const permissionTrigger = props.permissions?.find((i) => i.target === item.target)
          if (permissionTrigger) {
            changeAccess(permissionTrigger, item.access)
          }
        })
      }
    }
  })
}

const onChangeCheckbox = (permission: PermissionUpdatableTable, isCheck: boolean) => {
  const level = isCheck ? 1 : 0
  changeAccess(permission, level)
  onChangeTrigger(permission)
}

const onChangeCheckboxTable = (
  permission: PermissionUpdatableTable,
  value: number,
  isCheck: boolean
) => {
  let downLevelAccess = value - 1 > 0 ? value - 1 : 0
  const level = isCheck ? value : searchLevel(permission, downLevelAccess)
  changeAccess(permission, level)
  onChangeTrigger(permission)
}
</script>

<style lang="scss">
@import '../../../@core/scss/base/bootstrap-extended/_include';
@import '../../../@core/scss/base/components/_include';

.field-group-disabled {
  cursor: pointer;

  .input-group-text {
    background: $custom-select-disabled-bg;
  }
}

.table-box.table-permission {
  .table-responsive {
    margin-bottom: 0;
    padding-bottom: 0;
  }
  .custom-checkbox.custom-control {
    padding-left: 1.35rem;
  }
}
</style>

<style lang="scss" scoped>
.table-box {
  border-radius: 0.5rem 0.5rem 0 0;
  overflow: hidden;
  .header-table-th {
    border: none;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
</style>
