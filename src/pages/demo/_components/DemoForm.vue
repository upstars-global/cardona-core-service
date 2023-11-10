<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { DemoForm } from '../../../@model/demo'
import FieldGenerator from '../../../components/templates/FieldGenerator/index.vue'
import store from '../../../store'
import useToastService from '../../../helpers/toasts'
const { toastSuccess } = useToastService()

type Props = {
  entityId?: string
  form: DemoForm
  canUpdate?: boolean
  canRemove?:boolean
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
  isUpdatePage.value ? !props.canViewSeo : !props.canCreateSeo
)
const isDisabledField = computed(() => isUpdatePage.value && !props.canUpdate)
const isDisabledSeo = computed(() => isUpdatePage.value && !props.canUpdateSeo)

const mockUploadFile = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  toastSuccess('/mock/upload')
}
</script>


<template>
  <v-tabs class="mb-5">
    <v-tab id="mainTab" >
      {{$t('page.demo.fields')}}
    </v-tab>
  </v-tabs>
  <VWindow>
    <VWindowItem>
      <v-card >
        <template v-slot:title>{{ $t('page.demo.input') }}</template>

        <template v-slot:text>

          <VRow class="mb-2">
            <VCol cols="4">
              <field-generator v-model="formData.text" :disabled="isDisabledField" />
            </VCol>

          </VRow>
        </template>
      </v-card>
    </VWindowItem>
  </VWindow>
</template>
