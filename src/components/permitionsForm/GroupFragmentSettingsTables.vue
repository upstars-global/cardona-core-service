<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PermissionUpdatableTableList } from '../../@model/permission'
import GroupFragmentSettingsTable from '../../components/permitionsForm/GroupFragmentSettingsTable.vue'
import { VColors } from '../../@model/vuetify'

const props = defineProps<{
  title: string
  tables: PermissionUpdatableTableList[]
}>()

const checkeds = ref(props.tables.map(() => false))
const checked = ref(false)
const panel = ref(0)

const updateAllChecked = (index, val) => {
  checkeds.value[index] = val
  checked.value = checkeds.value.every(item => item)
}

watch(checked, val => {
  if (val)
    checkeds.value = checkeds.value.map(() => true)
})
</script>

<template>
  <VCard>
    <VExpansionPanels
      v-model="panel"
      multiple
    >
      <VExpansionPanel elevation="0">
        <VExpansionPanelTitle class="py-4">
          <div class="d-flex justify-space-between w-100 align-center">
            <span class="lead collapse-title text-body-1 font-weight-medium text-color-base">{{ title }}</span>
            <div
              class="pr-8"
              @click.stop
            >
              <VSwitch
                v-model="checked"
                :readonly="checked"
                :disabled="checked"
                :color="VColors.Primary"
                :label="$t('permission.fullAccess')"
                @click.stop
              />
            </div>
          </div>
        </VExpansionPanelTitle>
        <VExpansionPanelText class="px-0">
          <div
            v-for="(item, index) in tables"
            :key="item.title"
            class="block-table-inner"
          >
            <p
              v-if="item.title"
              class="text-body-1 font-weight-regular text-color-base"
            >
              {{ item.title }}
            </p>
            <GroupFragmentSettingsTable
              :permissions="item.permissions"
              :title="item.title"
              not-header
              :checked-table="checked"
              @update-all-checked="(val) => updateAllChecked(index, val)"
              @change="$emit('change')"
            />
          </div>
        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>
  </VCard>
</template>

<style lang="scss">
.block-table-inner {
  padding-top: 1rem;
  margin-top: 1.5rem;
  &:first-child {
    border-top: none;
    padding-top: 0;
    margin-top: 0;
  }
}
.field-group-disabled {
  cursor: pointer;
}
</style>
