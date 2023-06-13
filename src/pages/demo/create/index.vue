<template>
  <base-section :page-type="PageType.Create" :use-entity="useDemoSection">
    <template #default="{ form, canCreateSeo }">
      <demo-form :form="form" :can-create-seo="canCreateSeo" />
    </template>
  </base-section>
</template>

<script lang="ts">
export default {
  name: 'DemoCreate',
}
</script>

<script setup lang="ts">
import { useDemoSection } from '../useDemo'
import { PageType } from '../../../components/templates/BaseSection/model'
import BaseSection from '../../../components/templates/BaseSection/index.vue'
import DemoForm from '../_components/DemoForm.vue'
</script>
