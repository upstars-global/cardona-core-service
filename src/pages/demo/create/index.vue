<script setup lang="ts">
import { useDemoSection } from '../useDemo'
import BaseSection from '../../../components/templates/BaseSection/index.vue'
import { PageType } from '../../../@model/templates/baseSection'
import DemoForm from '@/pages/demo/_components/DemoForm.vue'
</script>

<template>
  <BaseSection
    :page-type="PageType.Create"
    :use-entity="useDemoSection"
    with-read-action
  >
    <template #default="{ form, canCreateSeo }">
      <DemoForm
        :form="form"
        :can-create-seo="canCreateSeo"
      />
    </template>
  </BaseSection>
</template>
