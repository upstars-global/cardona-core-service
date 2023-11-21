<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import type { DemoForm } from '../../../@model/demo'
import store from '../../../store'

// import useToastService from '../../../helpers/toasts'
import SeoForm from '../../../components/templates/SeoForm/index.vue'
import LocaleForm from '../../../components/templates/LocaleForm/index.vue'

// const { toastSuccess } = useToastService()

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

const props = defineProps<Props>()

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

  // toastSuccess('/mock/upload')
}

const currentTab = ref('main')
</script>

<template>
  <VTabs
    v-model="currentTab"
    class="mb-5"
  >
    <VTab value="main">
      {{ $t('page.demo.fields') }}
    </VTab>
    <VTab value="seo">
      {{ $t('title.seo') }}
    </VTab>
    <VTab value="localization">
      {{ $t('common.localization') }}
    </VTab>
  </VTabs>
  <VWindow v-model="currentTab">
    <VWindowItem value="main">
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
              <FieldGenerator
                v-model="formData.text"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>

          <VRow class="mb-2">
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.select"
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
    <VWindowItem value="seo">
      <SeoForm
        :value="formData.seo"
        :disabled="false"
      />
    </VWindowItem>
    <VWindowItem value="localization">
      <LocaleForm
        :value="formData"
        :disabled="false"
      />
    </VWindowItem>
  </VWindow>
</template>
