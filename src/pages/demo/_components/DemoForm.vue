<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import type { DemoForm } from '../../../@model/demo'
import { createPhoneDomainFieldItem } from '../../../@model/demo'
import store from '../../../store'
import useToastService from '@/helpers/toasts'

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
}

const formData = ref<DemoForm>({} as DemoForm)

watchEffect(() => {
  formData.value = props.form
})

const selectedProject = computed(() => store.getters.selectedProject)

const selectedProjectPublicName = computed(
  () => selectedProject.value?.publicName || store.getters.selectedProject?.title,
)

const isUpdatePage = computed(() => !!props.entityId)

const isDisabledTabs = computed(() =>
  isUpdatePage.value ? !props.canViewSeo : !props.canCreateSeo,
)

const isDisabledField = computed(() => isUpdatePage.value && !props.canUpdate)
const isDisabledSeo = computed(() => isUpdatePage.value && !props.canUpdateSeo)

const currentTab = ref('main')

const mockUploadFile = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  toastSuccess('/mock/upload')
}
</script>

<template>
  <VTabs
    v-model="currentTab"
    class="mb-6"
  >
    <VTab value="main">
      {{ $t('page.demo.fields') }}
    </VTab>
    <VTab
      value="seo"
      :disabled="isDisabledTabs"
    >
      {{ $t('title.seo') }}
    </VTab>
    <VTab
      value="localization"
      :disabled="isDisabledTabs"
    >
      {{ $t('common.localization') }}
    </VTab>
  </VTabs>
  <VWindow v-model="currentTab">
    <VWindowItem value="main">
      <VCard class="mb-7">
        <template #title>
          <div class="d-flex align-center justify-space-between">
            {{ $t('page.demo.input') }}

            <slot name="header-right" />
          </div>
        </template>

        <template #text>
          <BadgeCopy
            v-if="formData.id"
            :value="formData.id"
            class="mb-2"
          />

          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.text"
                :disabled="isDisabledField"
              />
            </VCol>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.textWithCb"
                :disabled="isDisabledField"
              />
            </VCol>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.email"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.number"
                :disabled="isDisabledField"
              />
            </VCol>

            <VCol cols="4">
              <FieldGenerator
                v-model="formData.digits"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.minute"
                :disabled="isDisabledField"
              />
            </VCol>

            <VCol cols="4">
              <FieldGenerator
                v-model="formData.minutesRange"
                :disabled="isDisabledField"
              />
            </VCol>

            <VCol cols="4">
              <FieldGenerator
                v-model="formData.percent"
                :disabled="isDisabledField"
              />
            </VCol>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.currency"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.sumRange"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>
          <VRow>
            <VCol>
              <FieldGenerator
                v-model="formData.rates"
                :disabled="isDisabledField"
                :with-label="false"
              />
            </VCol>
          </VRow>
        </template>
      </VCard>

      <VCard class="mb-7">
        <template #title>
          {{ $t('page.demo.select') }}
        </template>

        <template #text>
          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.select"
                :disabled="isDisabledField"
              />
            </VCol>

            <VCol cols="4">
              <FieldGenerator
                v-model="formData.nonClearableSelect"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.multiSelect"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>
        </template>
      </VCard>

      <VCard class="mb-7">
        <template #title>
          {{ $t('page.demo.check') }}
        </template>

        <template #text>
          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.switch"
                :disabled="isDisabledField"
              />
            </VCol>
            <hr>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.switchWithState"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.switch"
                disabled
              />
            </VCol>
            <hr>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.switchWithState"
                disabled
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.check"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.radio"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.checkGroup"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>
        </template>
      </VCard>

      <VCard class="mb-7">
        <template #title>
          {{ $t('common.date') }}
        </template>

        <template #text>
          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.date"
                :disabled="isDisabledField"
              />
            </VCol>

            <VCol cols="4">
              <FieldGenerator
                v-model="formData.dateTime"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>

          <VRow class="mt-1">
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.dateRange"
                :disabled="isDisabledField"
              />
            </VCol>

            <VCol cols="4">
              <FieldGenerator
                v-model="formData.dateTimeRange"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>

          <VRow class="mt-1">
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.time"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>
        </template>
      </VCard>

      <VCard class="mb-7">
        <template #title>
          {{ $t('page.demo.textarea') }}
        </template>

        <template #text>
          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.textarea"
                :disabled="isDisabledField"
              />
            </VCol>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.textareaWithCounter"
                :disabled="isDisabledField"
              />
            </VCol>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.textareaWithAutoHeight"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>
        </template>
      </VCard>
      <VCard>
        <template #title>
          {{ $t('page.demo.specific') }}
        </template>

        <template #text>
          <VRow>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.url"
                :disabled="isDisabledField"
              />
            </VCol>
            <VCol cols="4">
              <FieldGenerator
                v-model="formData.phone"
                :disabled="isDisabledField"
              />
            </VCol>

            <VCol cols="4">
              <FieldGenerator
                v-model="formData.password"
                :disabled="isDisabledField"
              />
            </VCol>
            <VCol
              cols="4"
              class="pt-2"
            >
              <FieldGenerator
                v-model="formData.passwordFieldWithGeneration"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>

          <VRow>
            <VCol cols="8">
              <FieldGenerator
                v-model="formData.tags"
                :disabled="isDisabledField"
              />
            </VCol>
            <VCol cols="8">
              <FieldGenerator
                v-model="formData.usersList"
                :disabled="isDisabledField"
              />
            </VCol>
            <VCol cols="8">
              <DynamicFieldList
                v-model="formData.phoneList"
                :template-field="createPhoneDomainFieldItem"
                show-even-label
                allow-add-with-empty
                :disabled="isDisabledField"
              />
            </VCol>
            <VCol cols="6">
              <FieldGenerator
                v-model="formData.conditions"
                :disabled="isDisabledField"
                :with-label="false"
              />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="8">
              <UploadImage
                v-model="formData.image"
                type="banners"
                size="md"
                :text-btn="$t('uploadImg.selectImage')"
                :path="`/${selectedProjectPublicName}/banners`"
                :disabled="isDisabledField"
              />
            </VCol>
          </VRow>
          <VRow>
            <VCol cols="8">
              <FilesUpload
                :disabled="isDisabledTabs"
                :on-submit-callback="mockUploadFile"
                :text-btn="$t('uploadFile.textBtn')"
                :data-types="['application/json']"
              >
                <template #content="{ fileSizeFormatted }">
                  <p class="mb-0 text-body-1 font-weight-medium text-medium-emphasis">
                    {{ $t('uploadFile.dropFile') }}
                  </p>
                  <p class="mb-0 text-body-2 text-medium-emphasis">
                    {{ $t('uploadFile.fileParams', { accept: 'JSON', size: fileSizeFormatted }) }}
                  </p>
                </template>
              </FilesUpload>
            </VCol>
          </VRow>
        </template>
      </VCard>
    </VWindowItem>
    <VWindowItem value="seo">
      <SeoForm
        v-model="formData.seo"
        :disabled="isDisabledSeo"
      />
    </VWindowItem>
    <VWindowItem value="localization">
      <LocaleForm
        v-model="formData.fieldTranslations"
        :form="formData"
        :disabled="isDisabledSeo"
      />
    </VWindowItem>
  </VWindow>
</template>
