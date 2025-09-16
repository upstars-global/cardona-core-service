<script setup lang="ts">
import { useSection } from '../useSettings'
import SectionForm from '../_components/SectionForm.vue'
import { PageType } from '../../../@model/templates/baseSection'
</script>

<template>
  <BaseSection
    :page-type="PageType.Update"
    :use-entity="useSection"
  >
    <template #default="{ form }">
      <SectionForm :form="form" />
    </template>
  </BaseSection>
</template>
