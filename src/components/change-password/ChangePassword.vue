<script setup lang="ts">
import { inject, ref } from 'vue'
import { PageType } from 'cardona-core-service/src/@model/templates/baseSection'
import { transformFormData } from 'cardona-core-service/src/helpers'
import { useSection } from '../../@model/changePassword'
import BaseModal from '../BaseModal/index.vue'
import FieldGenerator from '../templates/FieldGenerator/index.vue'
import BaseSection from '../templates/BaseSection/index.vue'
import ModalFooter from '../BaseModal/ModalFooter.vue'
import { ModalsId } from '../../@model/modalsId'
import { BaseSectionConfig } from '../../@model/templates/baseList'
import { useUsersStore } from '../../stores/users'

const props = withDefaults(defineProps<{
  id: string | number
  isProduct?: boolean
}>(), {
  isProduct: true,
})

const usersStore = useUsersStore()
const modal = inject('modal')
const passwordFormRef = ref()

const onSuccess = async () => {
  const form = transformFormData(passwordFormRef.value.form)
  if (!await passwordFormRef.value.validate())
    return
  const payload = { id: props.id, password: form.password, isProduct: props.isProduct }

  await usersStore.updateUserPassword(payload)

  onCloseModal()
}

const onCloseModal = () => {
  modal.hideModal(ModalsId.ChangePassword)
}

const baseSectionConfig = new BaseSectionConfig({
  withoutDeleteModal: true,
  withoutConfirmModal: true,
})
</script>

<template>
  <BaseModal
    :id="ModalsId.ChangePassword"
    :title="$t('modal.changePassword.title')"
    width="31.25rem"
  >
    <BaseSection
      ref="passwordFormRef"
      :use-entity="useSection"
      :config="baseSectionConfig"
      :with-read-action="false"
      :page-type="PageType.Empty"
      class="password-change"
    >
      <template #default="{ form }">
        <FieldGenerator v-model="form.password" />

        <FieldGenerator
          v-model="form.repeatPassword"
          class="repeat-password"
        />
      </template>
    </BaseSection>
    <template #modal-footer>
      <ModalFooter
        :accept="{
          label: $t('action.save'),
        }"
        @on-cancel="onCloseModal"
        @on-accept="onSuccess"
      />
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
.password-change {
  .repeat-password {
    padding-right: 2.825rem;
    padding-top: 0.5rem;
  }
}
</style>
