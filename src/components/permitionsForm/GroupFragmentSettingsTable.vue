<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import type { TranslateResult } from 'vue-i18n'
import { useI18n } from 'vue-i18n'
import { VColors } from '../../@model/vuetify'
import type { PermissionUpdatableTable } from '../../@model/permission'
import { IS_TEST_ENV } from '../../utils/constants'

interface Props {
  title: TranslateResult
  permissions: PermissionUpdatableTable[]
  notHeader?: boolean
  checkedTable?: boolean
  disabled?: boolean
}
interface Emits {
  (event: 'updateAllChecked', payload: boolean): void
  (event: 'change'): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emits>()
const i18n = useI18n()

const panel = ref(0)

const tableColumns = computed(() => [
  { key: 'target', label: i18n.t('permission.access') },
  { key: '1', label: i18n.t('permission.show') },
  { key: '2', label: i18n.t('permission.add') },
  { key: '3', label: i18n.t('permission.edit') },
  { key: '4', label: i18n.t('permission.delete') },
])

const tableItems = computed(
  () => props.permissions.filter(i => i.type === 'table') as PermissionUpdatableTable[],
)

const switchItems = computed(
  () => props.permissions.filter(i => i.type === 'switch') as PermissionUpdatableTable[],
)

const componentRendererName = computed(() => (props.notHeader ? 'div' : 'VExpansionPanel'))
const componentRenderer = computed(() => (props.notHeader ? 'div' : 'VExpansionPanel'))

const searchLevel = (permission: PermissionUpdatableTable, val: string) => {
  let levelAccessTable = Number(val)
  while (levelAccessTable !== 0 && permission.notAccessLevel?.includes(levelAccessTable)) {
    levelAccessTable--
  }

  return levelAccessTable
}

const getMaxValue = (permission: PermissionUpdatableTable) => {
  switch (permission.type) {
    case 'switch':
      return permission?.forAccessLevelValue || 1
    case 'table':
      return searchLevel(permission, tableColumns.value[tableColumns.value.length - 1].key)
  }
}

const checkFullAccess = () => {
  const accessAll = props.permissions.every(
    (permission: PermissionUpdatableTable) => permission.access === getMaxValue(permission),
  )

  emit('updateAllChecked', accessAll)

  return accessAll
}

const checked = ref(checkFullAccess())

watch(checked, val => {
  if (val) {
    props.permissions.forEach(permission => {
      changeAccess(permission, getMaxValue(permission))
    })
  }
})

watch(
  () => props.checkedTable,
  val => {
    if (val) {
      props.permissions.forEach(permission => {
        changeAccess(permission, getMaxValue(permission))
      })
    }
  },
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
  level: number = permission.access,
) => {
  permission.trigger?.forEach(item => {
    const isLevelTrigger
      = level === 0 ? level === item.addictionLevelItem : level >= item.addictionLevelItem

    if (isLevelTrigger) {
      let ifAddiction = true
      item.addiction?.forEach(item => {
        const permissionAddiction = props.permissions?.find(i => i.target === item.target)
        if (permissionAddiction) {
          const isAccessTrigger
            = item.access === 0 || permissionAddiction.access === 0
              ? permissionAddiction.access !== item.access
              : permissionAddiction.access < item.access

          if (isAccessTrigger)
            ifAddiction = false
        }
      })

      if (ifAddiction) {
        item.itemActive?.forEach(item => {
          const permissionTrigger = props.permissions?.find(i => i.target === item.target)
          if (permissionTrigger)
            changeAccess(permissionTrigger, item.access)
        })
      }
    }
  })
}

const onChangeSwitch = (permission: PermissionUpdatableTable, isCheck: boolean) => {
  const itemPermissionLevel = permission?.forAccessLevelValue || 1
  const level = isCheck ? itemPermissionLevel : 0

  changeAccess(permission, level)
  onChangeTrigger(permission)
}

const onChangeCheckboxTable = (
  permission: PermissionUpdatableTable,
  value: number,
  isCheck: boolean,
) => {
  const downLevelAccess = value - 1 > 0 ? value - 1 : 0
  const level = isCheck ? value : searchLevel(permission, downLevelAccess)

  changeAccess(permission, level)
  onChangeTrigger(permission)
}
</script>

<template>
  <VExpansionPanels
    v-model="panel"
    multiple
  >
    <VExpansionPanel
      elevation="0"
      :eager="IS_TEST_ENV"
    >
      <VExpansionPanelTitle
        v-if="!notHeader"
        class="py-4 text-color-base"
      >
        <div class="d-flex justify-space-between w-100 align-center">
          <h5
            v-if="title"
            class="lead collapse-title text-h5 text-body-1 font-weight-medium"
            data-test-id="collapse-title"
          >
            {{ title }}
          </h5>
          <div
            class="pr-8"
            @click.stop
          >
            <VSwitch
              v-model="checked"
              data-test-id="switch-all"
              :readonly="checked"
              :disabled="disabled || checked"
              :color="VColors.Primary"
              :label="$t('permission.fullAccess')"
            />
          </div>
        </div>
      </VExpansionPanelTitle>
      <VExpansionPanelText
        :class="{ 'inner-table': notHeader }"
        :eager="IS_TEST_ENV"
      >
        <Component
          :is="componentRenderer"
          :key="componentRendererName"
          is-visible
          class="pa-0"
        >
          <div class="table-box table-permission">
            <VTable
              v-if="tableItems.length"
              responsive
              caption-top
              data-test-id="permission-table"
              class="group-fragment-setting-table"
            >
              <thead>
                <tr class="header-table">
                  <th
                    v-for="tableColumn in tableColumns"
                    :key="tableColumn.key"
                    :class="{ 'text-center': tableColumn.key !== 'target' }"
                    class="px-2 header-table-th"
                  >
                    <span
                      class="font-weight-medium text-color-mute"
                      data-test-id="col-label"
                    >
                      {{ tableColumn.label }}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody class="body-table">
                <tr
                  v-for="tableItem in tableItems"
                  :key="tableItem.target"
                >
                  <td
                    v-for="(tableColumn, index) in tableColumns"
                    :key="tableColumn.value"
                    class="m-0 py-1 px-2"
                  >
                    <span
                      v-if="index === 0"
                      class="font-weight-regular text-color-base"
                      :data-test-id="`permission-with-checkbox-${tableItem.target}`"
                    >
                      {{ $t(`permission.${tableItem.target}`) }}
                    </span>
                    <template v-else>
                      <div class="d-flex justify-center">
                        <VCheckbox
                          v-if="!tableItem.notAccessLevel?.includes(Number(tableColumn.key))"
                          :data-test-id="`permission-checkbox-${tableItem.target}-${tableColumn.key}`"
                          :model-value="+tableItem.access >= +tableColumn.key"
                          :disabled="disabled"
                          @update:model-value="onChangeCheckboxTable(tableItem, Number(tableColumn.key), $event)"
                        />
                        <span
                          v-else
                          class="text-color-base"
                          :data-test-id="`empty-${tableItem.target}-${tableColumn.key}`"
                        > - </span>
                      </div>
                    </template>
                  </td>
                </tr>
              </tbody>
            </VTable>
          </div>
          <hr
            v-if="tableItems.length"
            class="mb-6"
          >
          <div
            v-if="switchItems.length"
            class="m-0"
            :class="{ 'pt-2 border-top': tableItems.length }"
          >
            <VRow
              v-for="(switchItem, index) in switchItems"
              :key="switchItem.target"
              class="mx-0 mb-1 px-2"
              :class="{ 'pb-1 border-bottom': index !== switchItems.length - 1 }"
            >
              <VSwitch
                :data-test-id="`permission-switch-${switchItem.target}`"
                :model-value="switchItem.access > 0"
                class="ml-0"
                :label="$t(`permission.${switchItem.target}`)"
                :disabled="disabled"
                @update:model-value="onChangeSwitch(switchItem, $event)"
              />
            </VRow>
          </div>
        </Component>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>

<style lang="scss">
.field-group-disabled {
  cursor: pointer;
}

.collapse-title {
  //color: rgba(var(--v-theme-grey-900), var(--v-body-opacity)) !important;
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

.group-fragment-setting-table {
  .header-table {
    background-color: rgb(var(--v-theme-background));
  }
}

.table-box {
  border-radius: 0.5rem 0.5rem 0 0;
  overflow: hidden;
  .header-table-th {
    border: none;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
.inner-table {
  .v-expansion-panel-text__wrapper {
    padding: 0;
  }
}
</style>
