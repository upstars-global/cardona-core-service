<script setup lang="ts">
import { useStore } from 'vuex'
import { inject, ref } from 'vue'
import { useSection } from '../../@model/changePassword'
import BaseModal from '../BaseModal/index.vue'
import FieldGenerator from '../templates/FieldGenerator/index.vue'
import BaseSection from '../templates/BaseSection/index.vue'
import { ModalsId } from '../../@model/modalsId'
import { VColors, VVariants } from '../../@model/vuetify'
import type { BaseField } from '../../@model/templates/baseField'
import { BaseSectionConfig } from '../../@model/templates/baseList'

const props = withDefaults(defineProps<{
  id: string | number
  isProduct?: boolean
}>(), {
  isProduct: true,
})

const modal = inject('modal')
const store = useStore()
const passwordFormRef = ref()

const onSuccess = async (form: Record<string, BaseField>) => {
  if (!await passwordFormRef.value.validate())
    return

  const payload = { id: props.id, password: form.password.value, isProduct: props.isProduct }

  await store.dispatch('users/updateUserPassword', payload)

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
  >
    <BaseSection
      ref="passwordFormRef"
      :use-entity="useSection"
      :config="baseSectionConfig"
      :with-read-action="false"
      class="px-6 py-6 password-change"
    >
      <template #default="{ form }">
        <FieldGenerator v-model="form.password" />

        <FieldGenerator
          v-model="form.repeatPassword"
          class="repeat-password"
        />
      </template>
      <template #actions="{ form }">
        <div class="d-flex justify-end gap-2 mt-6">
          <VBtn
            :variant="VVariants.Outlined"
            :color="VColors.Secondary"
            :text="$t('action.cancel')"
            @click="onCloseModal"
          />
          <VBtn
            :text="$t('action.save')"
            @click="onSuccess(form)"
          />
        </div>
      </template>
    </BaseSection>
  </BaseModal>
</template>

<style lang="scss" scoped>
.password-change {
  width: 31.25rem;

  .repeat-password {
    padding-right: 2.825rem;
    padding-top: 0.5rem;
  }
}
</style>
