<script setup lang="ts">
import { ref } from 'vue'
import type { Permission } from '../../@model/permission'
import { AllPermission } from '../../@model/permission'
import GroupFragmentSettingsTable from './GroupFragmentSettingsTable.vue'

const props = defineProps<{
  permissions: Permission[]
}>()

const emit = defineEmits<{
  (event: 'updatePermissions', permissions: Permission[]): void
}>()

const allPermissionModel = new AllPermission(props.permissions)
const allPermission = ref(allPermissionModel.allPermission)

const onChange = () => {
  emit('updatePermissions', allPermissionModel.toPermissionArray())
}
</script>

<template>
  <VCard class="group-fragment-settings">
    <VCardText class="pt-6 pb-5">
      <span class="group-fragment-settings text-h4 font-weight-semi-bold">
        {{ $t('page.groupFragment.groupSettings') }}
      </span>
    </VCardText>

    <GroupFragmentSettingsTable
      :permissions="allPermission.demoPage"
      :title="$t('page.groupFragment.accessControl')"
      class="pa-6 pt-0"
      @change="onChange"
    />
  </VCard>
</template>

<style lang="scss" scoped>
.group-fragment-settings {
  .v-tabs.v-tabs--horizontal{
    border-block-end: none;
  }
}
</style>
