<template>
  <base-section :page-type="PageType.Update" :use-entity="useDemoSection" :config="config">
    <template
      #default="{ entityId, form, canUpdate, canRemove, canViewSeo, canUpdateSeo, onClickRemove }"
    >
      <demo-form
        :demo-id="entityId"
        :entity-id="entityId"
        :form="form"
        :can-update="canUpdate"
        :can-remove="canRemove"
        :can-view-seo="canViewSeo"
        :can-update-seo="canUpdateSeo"
        :remove-handler="onClickRemove"
      >
        <template #header-right>
          <b-button variant="danger" class="ml-2" @click="onClickRemove(entityId)">
            {{ $t('action.remove') }}
          </b-button>
        </template>
      </demo-form>
    </template>
  </base-section>
</template>

<script lang="ts">
export default {
  name: 'DemoUpdate',
}
</script>

<script setup lang="ts">
import { useDemoSection } from '../useDemo'
import { PageType } from '../../../components/templates/BaseSection/model'
import BaseSection from '../../../components/templates/BaseSection/index.vue'
import DemoForm from '../_components/DemoForm.vue'
import { BaseSectionConfig } from '../../../components/templates/BaseList/model'

const config = new BaseSectionConfig({
  withCustomModuleName: true,
  customModuleName: 'demo',
})
</script>
