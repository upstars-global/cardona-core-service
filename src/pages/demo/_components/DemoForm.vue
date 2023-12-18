<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import type { DemoForm } from '../../../@model/demo'
import FieldGenerator from '../../../components/templates/FieldGenerator/index.vue'
import store from '../../../store'
import useToastService from '../../../helpers/toasts'
import {createPhoneDomainFieldItem} from "../../../@model/demo";

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
          <VCard class="mb-7">
            <template #title>
              {{ $t('page.demo.input') }}
            </template>

            <template #text>
              <badge-copy v-if="formData.id" :value="formData.id" class="mb-2" />

              <VRow class="mb-2">
                <VCol cols="4">
                  <FieldGenerator v-model="formData.text" :disabled="isDisabledField" />
                </VCol>
                <VCol cols="4">
                  <FieldGenerator v-model="formData.textWithCb" :disabled="isDisabledField" />
                </VCol>
                <VCol cols="4">
                  <FieldGenerator v-model="formData.email" :disabled="isDisabledField" />
                </VCol>
              </VRow>

              <VRow class="mb-2">
                <VCol cols="4">
                  <FieldGenerator v-model="formData.number" :disabled="isDisabledField" />
                </VCol>

                <VCol cols="4">
                  <FieldGenerator v-model="formData.digits" :disabled="isDisabledField" />
                </VCol>
              </VRow>

              <VRow class="mb-2">
                <VCol cols="4">
                  <FieldGenerator v-model="formData.minute" :disabled="isDisabledField" />
                </VCol>

                <VCol cols="4">
                  <FieldGenerator v-model="formData.minutesRange" :disabled="isDisabledField" />
                </VCol>

                <VCol cols="4">
                  <FieldGenerator v-model="formData.percent" :disabled="isDisabledField" />
                </VCol>
              </VRow>

              <VRow class="mb-2">
                <VCol cols="4">
                  <FieldGenerator v-model="formData.sumRange" :disabled="isDisabledField" />
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
              <VRow class="mb-2">
                <VCol cols="4">
                  <FieldGenerator v-model="formData.select" :disabled="isDisabledField" />
                </VCol>

                <VCol cols="4">
                  <FieldGenerator v-model="formData.nonClearableSelect" :disabled="isDisabledField" />
                </VCol>
              </VRow>

              <VRow>
                <VCol cols="4">
                  <FieldGenerator v-model="formData.multiSelect" :disabled="isDisabledField" />
                </VCol>
              </VRow>
            </template>
          </VCard>
          <VCard class="mb-7">
            <template #title>
                {{ $t('page.demo.check') }}
            </template>

            <template #text>
              <VRow class="mb-2">
                <VCol cols="4">
                  <FieldGenerator v-model="formData.switch" :disabled="isDisabledField" />
                </VCol>

                <VCol cols="4">
                  <FieldGenerator v-model="formData.switchWithState" :disabled="isDisabledField" />
                </VCol>
              </VRow>

              <VRow class="mb-2">
                <VCol cols="4">
                  <FieldGenerator v-model="formData.check" :disabled="isDisabledField" />
                </VCol>
              </VRow>

              <VRow class="mb-2">
                <VCol cols="4">
                  <FieldGenerator v-model="formData.radio" :disabled="isDisabledField" />
                </VCol>
              </VRow>

              <VRow>
                <VCol cols="4">
                  <FieldGenerator v-model="formData.checkGroup" :disabled="isDisabledField" />
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
                  <FieldGenerator v-model="formData.date" :disabled="isDisabledField" />
                </VCol>

                <VCol cols="4">
                  <FieldGenerator v-model="formData.dateTime" :disabled="isDisabledField" />
                </VCol>
              </VRow>

              <VRow class="mt-1">
                <VCol cols="4">
                  <FieldGenerator v-model="formData.dateRange" :disabled="isDisabledField" />
                </VCol>

                <VCol cols="4">
                  <FieldGenerator v-model="formData.dateTimeRange" :disabled="isDisabledField" />
                </VCol>
              </VRow>

              <VRow class="mt-1">
                <VCol cols="4">
                  <FieldGenerator v-model="formData.dateBtn" :disabled="isDisabledField" />
                </VCol>

                <VCol cols="4">
                  <FieldGenerator v-model="formData.time" :disabled="isDisabledField" />
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
                  <FieldGenerator v-model="formData.textarea" :disabled="isDisabledField" />
                </VCol>

                <VCol cols="4">
                  <FieldGenerator v-model="formData.textareaWithCounter" :disabled="isDisabledField" />
                </VCol>
              </VRow>
            </template>
          </VCard>
          <VCard>
            <template #title>
              {{ $t('page.demo.specific') }}
            </template>

            <template #text>
              <VRow class="mb-2">
                <VCol cols="4">
                  <FieldGenerator v-model="formData.url" :disabled="isDisabledField" />
                </VCol>
                <VCol cols="4">
                  <FieldGenerator v-model="formData.phone" :disabled="isDisabledField" />
                </VCol>

                <VCol cols="4">
                  <FieldGenerator v-model="formData.password" :disabled="isDisabledField" />
                </VCol>
                <VCol cols="4" class="pt-2">
                  <FieldGenerator
                      v-model="formData.passwordFieldWithGeneration"
                      :disabled="isDisabledField"
                  />
                </VCol>
              </VRow>

              <VRow class="mb-2">
                <VCol cols="8" class="mb-2">
                  <FieldGenerator v-model="formData.tags" :disabled="isDisabledField" />
                </VCol>
                <VCol cols="8">
                  <FieldGenerator v-model="formData.usersList" :disabled="isDisabledField" />
                </VCol>
                <VCol cols="8">
                  <DynamicFieldList
                      v-model="formData.phoneList"
                      :template-field="createPhoneDomainFieldItem()"
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
            </template>
          </VCard>
        </VWindowItem>
    </VWindow>
</template>
