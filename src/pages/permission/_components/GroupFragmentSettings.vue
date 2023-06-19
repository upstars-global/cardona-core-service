<script setup lang="ts">
import GroupFragmentSettingsTable from './GroupFragmentSettingsTable.vue'
import { BCard, BCardTitle, BTabs } from 'bootstrap-vue'
import { ref } from 'vue'
import { AllPermission, Permission } from '../../../@model/permission'
import AppCollapse from '../../../@core/components/app-collapse/AppCollapse.vue'

const emit = defineEmits<{
  (event: 'updatePermissions', permissions: Permission[]): void
}>()
const props = defineProps<{
  permissions: Permission[]
}>()
const checked = ref(false)
const allPermissionModel = new AllPermission(props.permissions)
const allPermission = ref(allPermissionModel.allPermission)

const onChange = () => {
  emit('updatePermissions', allPermissionModel.toPermissionArray())
}
</script>

<template>
  <b-card>
    <b-card-title>{{ $t('page.groupFragment.groupSettings') }}</b-card-title>
    <b-tabs class="tabs-permission">
      <app-collapse accordion type="margin" class="mt-2">
        <group-fragment-settings-table
          :permissions="allPermission.demoPage"
          :title="$t('page.groupFragment.accessControl')"
          @change="onChange"
        />
      </app-collapse>
    </b-tabs>
  </b-card>
</template>

<style lang="scss">
@import 'src/assets/scss/style';

.tabs-permission .collapse-margin .card {
  box-shadow: none !important;
  border-bottom: 1px solid $border-color !important;
  margin-bottom: 1.5rem;
}
.field-group-disabled {
  cursor: pointer;

  .input-group-text {
    background: $custom-select-disabled-bg;
  }
}
</style>
