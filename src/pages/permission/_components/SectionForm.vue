<template>
  <div>
    <group-fragment-settings
      v-if="formData?.permissions"
      :key="formData.id"
      :permissions="formData.permissions"
      @updatePermissions="onUpdatePermissions"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { Permission } from '../../../@model/permission'
import { GroupForm } from '../../../@model/group'
import { useSection } from '../useSettings'
import GroupFragmentSettings from './GroupFragmentSettings.vue'

const props = defineProps<{
  form: GroupForm
}>()

const formData = ref<GroupForm>(new GroupForm())
const { entityName } = useSection()

watchEffect(() => {
  formData.value = props.form
})

const onUpdatePermissions = (permissions: Permission[]) => {
  formData.value.permissions = permissions
}
</script>
