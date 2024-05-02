<script setup lang="ts">
import { useStore } from 'vuex'
import { inject } from 'vue'
import { useSection } from '../../@model/changePassword'
import BaseModal from '../BaseModal/index.vue'
import FieldGenerator from '../templates/FieldGenerator/index.vue'
import BaseSection from '../templates/BaseSection/index.vue'
import { ModalsId } from '../../@model/modalsId'
import { VColors, VVariants } from '../../@model/vuetify'
import type { BaseField } from '@/@model/templates/baseField'

const props = defineProps<{
  id: string | number
}>()

const modal = inject('modal')
const store = useStore()

const onSuccess = async (form: Record<string, BaseField>) => {
  const payload = { id: props.id, password: form.password.value }

  await store.dispatch('users/updateUserPassword', payload)

  onCloseModal()
}

const onCloseModal = () => {
  modal.hideModal(ModalsId.ChangePassword)
}
</script>

<template>
  <BaseModal
    :id="ModalsId.ChangePassword"
    :title="$t('modal.changePassword.title')"
  >
    <BaseSection
      :use-entity="useSection"
      :with-read-action="false"
      class="px-6 py-6 password-change"
    >
      <template #default="{ form }">
        <FieldGenerator
          v-model="form.password"
          class="mb-2"
        />
        <FieldGenerator
          v-model="form.repeatPassword"
          class="mb-2 pr-4"
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
}
</style>
