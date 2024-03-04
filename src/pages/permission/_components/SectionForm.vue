<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { Permission } from '../../../@model/permission'
import { GroupForm } from '../../../@model/group'
import GroupFragmentSettings from '@/components/permitionsForm/GroupFragmentSettings.vue'

const props = defineProps<{
  form: GroupForm
}>()

const formData = ref<GroupForm>(new GroupForm())

watchEffect(() => {
  formData.value = props.form
})

const onUpdatePermissions = (permissions: Permission[]) => {
  formData.value.permissions = permissions
}
</script>

<template>
  <GroupFragmentSettings
    v-if="formData?.permissions"
    :key="formData.id"
    :permissions="formData.permissions"
    @updatePermissions="onUpdatePermissions"
  />
</template>
