<script setup lang="ts">
import { ref, watch } from 'vue'
import type { PermissionUpdatableTableList } from 'cardona-core-service/src/@model/permission'
import GroupFragmentSettingsTable from 'cardona-core-service/src/components/permitionsForm/GroupFragmentSettingsTable.vue'
import { VColors } from 'cardona-core-service/src/@model/vuetify'

const props = defineProps<{
  title: string
  tables: PermissionUpdatableTableList[]
}>()

const checkeds = ref(props.tables.map(() => false))
const checked = ref(false)

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
  <VExpansionPanels>
    <VExpansionPanel>
      <VExpansionPanelTitle class="gap-2 py-4">
        <div class="d-flex justify-space-between align-center full-width">
          <span class="lead collapse-title ">{{ title }}</span>
          <VSwitch
            v-model="checked"
            :readonly="checked"
            :color="VColors.Primary"
            :label="$t('permission.fullAccess')"
            @click.stop
          />
        </div>
      </VExpansionPanelTitle>
      <VExpansionPanelText>
        <div
          v-for="(item, index) in tables"
          :key="item.title"
          class="block-table-inner"
        >
          <p
            v-if="item.title"
            class="font-weight-bold"
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
