<template>
  <c-modal
    :id="ModalsId.ChangePassword"
    :title="$t('modal.changePassword.title')"
    :size="BSize.Md"
    :ok-title="$t('action.save')"
    @ok="onSuccess"
    @hidden="clearForm"
  >
    <base-section ref="formRef" :use-entity="useSection" :with-read-action="false">
      <template #default="{ form }">
        <field-generator v-model="form.password" class="mb-2" />
        <field-generator v-model="form.repeatPassword" class="mb-2 pr-4" />
      </template>
    </base-section>
  </c-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FieldGenerator from '../../../components/templates/FieldGenerator/index.vue'
import BaseSection from '../../../components/templates/BaseSection/index.vue'
import { useSection } from '../../../@model/changePassword'
import store from '../../../store'
import CModal from '../../../components/CModal.vue'
import { ModalsId } from '../../../@model/modalsId'
import { BSize } from '../../../@model/bootstrap'

const props = defineProps<{
  id: string | number
}>()
const formRef = ref<InstanceType<typeof BaseSection> | null>(null)

const clearForm = () => {
  formRef.value?.resetForm()
}

const onSuccess = async (hide: Function) => {
  if (!(await formRef.value?.validate())) return

  const payload = { id: props.id, password: formRef.value?.form.password.value }
  await store.dispatch('users/updateUserPassword', payload)

  hide()
}
</script>
