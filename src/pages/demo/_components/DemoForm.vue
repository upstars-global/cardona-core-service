<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import type { DemoForm } from '../../../@model/demo'
import FieldGenerator from '../../../components/templates/FieldGenerator/index.vue'
import store from '../../../store'
import useToastService from '../../../helpers/toasts'

const props = defineProps<Props>()

const { toastSuccess } = useToastService()

interface Props {
  entityId?: string
  form: DemoForm
  canUpdate?: boolean
  canRemove?: boolean
  canViewSeo?: boolean
  canCreateSeo?: boolean
  canUpdateSeo?: boolean
  removeHandler: Function
}

const formData = ref<DemoForm>({} as DemoForm)

watchEffect(() => {
  formData.value = props.form
})

const selectedProject = computed(() => store.getters.selectedProject)

const selectedProjectPublicName = computed(
  () => selectedProject.value?.publicName || store.getters.selectedProject?.title
)

const isUpdatePage = computed(() => !!props.entityId)

const isDisabledTabs = computed(() =>
  isUpdatePage.value ? !props.canViewSeo : !props.canCreateSeo,
)

const isDisabledField = computed(() => isUpdatePage.value && !props.canUpdate)
const isDisabledSeo = computed(() => isUpdatePage.value && !props.canUpdateSeo)

const mockUploadFile = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  toastSuccess('/mock/upload')
}
</script>

<template>
  <VTabs class="mb-5">
    <VTab id="mainTab">
      {{ $t('page.demo.fields') }}
    </VTab>
  </VTabs>
  <VWindow>
    <VWindowItem>
      <VCard>
        <template #title>
          {{ $t('page.demo.input') }}
        </template>

        <template #text>
          <VRow class="mb-2">
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.text"
                :disabled="isDisabledField"
              />
            </VCol>
            <VCol cols="8">
              <FieldGenerator
                v-model="formData.richText"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>
        </template>
      </VCard>
    </VWindowItem>
  </VWindow>
</template>
