<script setup lang="ts">
import { useSection } from '../useSettings'
import SectionForm from '../_components/SectionForm.vue'
import { BaseSectionConfig } from '../../../@model/templates/baseList'
import { PageType } from '../../../@model/templates/baseSection'

const config = new BaseSectionConfig({
  withCustomModuleName: true,
  customModuleName: 'permissions',
})
</script>

<template>
  <BaseSection
    :page-type="PageType.Update"
    :use-entity="useSection"
    :config="config"
  >
    <template #default="{ form }">
      <SectionForm :form="form" />
    </template>
  </BaseSection>
</template>
