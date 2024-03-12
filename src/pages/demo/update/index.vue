<script setup lang="ts">
import { useDemoSection } from '../useDemo'
import BaseSection from '../../../components/templates/BaseSection/index.vue'
import { PageType } from '../../../@model/templates/baseSection'
import { VColors } from '../../../@model/vuetify'
import DemoForm from '@/pages/demo/_components/DemoForm.vue'
</script>

<template>
  <BaseSection
    :page-type="PageType.Update"
    :use-entity="useDemoSection"
  >
    <template #default="{ entityId, form, canUpdate, canRemove, canViewSeo, canUpdateSeo, onClickRemove }">
      <DemoForm
        :entity-id="entityId"
        :form="form"
        :can-update="canUpdate"
        :can-remove="canRemove"
        :can-view-seo="canViewSeo"
        :can-update-seo="canUpdateSeo"
        :remove-handler="onClickRemove"
      >
        <template #header-right>
          <VBtn
            v-if="canRemove"
            :color="VColors.Error"
            class="ml-2"
            @click="onClickRemove(entityId)"
          >
            {{ $t('action.remove') }}
          </VBtn>
        </template>
      </DemoForm>
    </template>
  </BaseSection>
</template>
