<template>
  <base-section :page-type="PageType.Update" :use-entity="useSection" :config="config">
    <template #default="{ form }">
      <section-form :form="form" />
    </template>
  </base-section>
</template>

<script lang="ts">
export default {
  name: 'PermissionsUpdate',
}
</script>

<script setup lang="ts">
import { useSection } from '../useSettings'
import { PageType } from '../../../components/templates/BaseSection/model'
import BaseSection from '../../../components/templates/BaseSection/index.vue'
import { BaseSectionConfig } from '../../../components/templates/BaseList/model'
import SectionForm from '../_components/SectionForm.vue'

const config = new BaseSectionConfig({
  withCustomModuleName: true,
  customModuleName: 'permissions',
})
</script>
