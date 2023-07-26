<template>
  <b-tabs nav-class="pb-1">
    <b-tab active :title="$t('page.demo.fields')">
      <b-card no-body>
        <b-card-header>
          <b-card-title>
            {{ $t('page.demo.input') }}
          </b-card-title>

          <div class="d-flex justify-content-end align-items-center">
            <slot name="header-right" />
          </div>
        </b-card-header>

        <b-card-body>
          <badge-copy v-if="formData.id" :value="formData.id" class="mb-2" />

          <b-row class="mb-2">
            <b-col cols="4">
              <field-generator v-model="formData.text" :disabled="isDisabledField" />
            </b-col>
            <b-col cols="4">
              <field-generator v-model="formData.email" :disabled="isDisabledField" />
            </b-col>

            <b-col cols="4">
              <field-generator v-model="formData.number" :disabled="isDisabledField" />
            </b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col cols="4">
              <field-generator v-model="formData.minute" :disabled="isDisabledField" />
            </b-col>

            <b-col cols="4">
              <field-generator v-model="formData.percent" :disabled="isDisabledField" />
            </b-col>

            <b-col cols="4">
              <field-generator v-model="formData.digits" :disabled="isDisabledField" />
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="4">
              <field-generator v-model="formData.sumRange" :disabled="isDisabledField" />
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <b-card no-body>
        <b-card-header>
          <b-card-title>
            {{ $t('page.demo.select') }}
          </b-card-title>
        </b-card-header>

        <b-card-body>
          <b-row>
            <b-col cols="4">
              <field-generator v-model="formData.select" :disabled="isDisabledField" />
            </b-col>

            <b-col cols="4">
              <field-generator v-model="formData.multiSelect" :disabled="isDisabledField" />
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <b-card no-body>
        <b-card-header>
          <b-card-title>
            {{ $t('page.demo.check') }}
          </b-card-title>
        </b-card-header>

        <b-card-body>
          <b-row class="mb-2">
            <b-col cols="4">
              <field-generator v-model="formData.switch" :disabled="isDisabledField" />
            </b-col>

            <b-col cols="4">
              <field-generator v-model="formData.switchWithState" :disabled="isDisabledField" />
            </b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col cols="4">
              <field-generator v-model="formData.check" :disabled="isDisabledField" />
            </b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col cols="4">
              <field-generator v-model="formData.radio" :disabled="isDisabledField" />
            </b-col>
          </b-row>

          <b-row>
            <b-col cols="4">
              <field-generator v-model="formData.checkGroup" :disabled="isDisabledField" />
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <b-card no-body>
        <b-card-header>
          <b-card-title>
            {{ $t('common.date') }}
          </b-card-title>
        </b-card-header>

        <b-card-body>
          <b-row>
            <b-col cols="4">
              <field-generator v-model="formData.date" :disabled="isDisabledField" />
            </b-col>

            <b-col cols="4">
              <field-generator v-model="formData.dateTime" :disabled="isDisabledField" />
            </b-col>

            <b-col cols="4">
              <field-generator v-model="formData.dateRange" :disabled="isDisabledField" />
            </b-col>
          </b-row>
          <b-row class="mt-1">
            <b-col cols="4">
              <field-generator v-model="formData.dateBtn" :disabled="isDisabledField" />
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <b-card no-body>
        <b-card-header>
          <b-card-title>
            {{ $t('page.demo.textarea') }}
          </b-card-title>
        </b-card-header>

        <b-card-body>
          <b-row>
            <b-col cols="4">
              <field-generator v-model="formData.textarea" :disabled="isDisabledField" />
            </b-col>

            <b-col cols="4">
              <field-generator v-model="formData.textareaWithCounter" :disabled="isDisabledField" />
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>

      <b-card no-body>
        <b-card-header>
          <b-card-title>
            {{ $t('page.demo.specific') }}
          </b-card-title>
        </b-card-header>

        <b-card-body>
          <b-row class="mb-2">
            <b-col cols="4">
              <field-generator v-model="formData.url" :disabled="isDisabledField" />
            </b-col>
            <b-col cols="4">
              <field-generator v-model="formData.phone" :disabled="isDisabledField" />
            </b-col>

            <b-col cols="4">
              <field-generator v-model="formData.password" :disabled="isDisabledField" />
            </b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col cols="8">
              <field-generator v-model="formData.tags" :disabled="isDisabledField" />
            </b-col>
          </b-row>
          <b-row>
            <b-col cols="8">
              <upload-image
                v-model="formData.image"
                type="banners"
                size="md"
                :text-btn="$t('uploadImg.selectImage')"
                :path="`/${selectedProjectPublicName}/banners`"
                :disabled="isDisabledField"
              />
            </b-col>

            <b-col cols="8">
              <upload-file size="md" :disabled="disabled" :on-submit-callback="mockUploadFile" />
            </b-col>
          </b-row>
        </b-card-body>
      </b-card>
    </b-tab>

    <b-tab v-if="formData" :title="$t('title.seo')" :disabled="isDisabledTabs">
      <seo-form v-model="formData" :disabled="isDisabledSeo" />
    </b-tab>

    <b-tab v-if="formData" :title="$t('title.localization')" :disabled="isDisabledTabs">
      <locale-form v-model="formData" :disabled="isDisabledSeo" />
    </b-tab>
  </b-tabs>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { DemoForm } from '../../../@model/demo'
import FieldGenerator from '../../../components/templates/FieldGenerator/index.vue'
import SeoForm from '../../../components/templates/SeoForm/index.vue'
import LocaleForm from '../../../components/templates/LocaleForm/index.vue'
import BadgeCopy from '../../../components/BadgeCopy.vue'
import UploadImage from '../../../components/UploadImage/index.vue'
import store from '../../../store'
import UploadFile from '../../../components/UploadFile/index.vue'
import useToastService from '../../../helpers/toasts'
const { toastSuccess } = useToastService()

type Props = {
  entityId?: string
  form: DemoForm
  canUpdate?: boolean
  canViewSeo?: boolean
  canCreateSeo?: boolean
  canUpdateSeo?: boolean
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
  isUpdatePage.value ? !props.canViewSeo : !props.canCreateSeo
)
const isDisabledField = computed(() => isUpdatePage.value && !props.canUpdate)
const isDisabledSeo = computed(() => isUpdatePage.value && !props.canUpdateSeo)

const mockUploadFile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  toastSuccess('/mock/upload')
}
</script>
