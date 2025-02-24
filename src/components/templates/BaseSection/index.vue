<script setup lang="ts">
import { computed, inject, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form } from 'vee-validate'
import { useStore } from 'vuex'
import { IconsList } from '../../../@model/enums/icons'
import { checkExistsPage, convertLowerCaseFirstSymbol, transformFormData } from '../../../helpers'
import { basePermissions } from '../../../helpers/base-permissions'
import { PageType } from '../../../@model/templates/baseSection'
import { BaseSectionConfig } from '../../../@model/templates/baseList'
import { VColors, VVariants } from '../../../@model/vuetify'
import RemoveModal from '../../../components/BaseModal/RemoveModal.vue'
import ConfirmModal from '../../../components/BaseModal/ConfirmModal.vue'
import { ModalsId } from '../../..//@model/modalsId'
import { useRedirectToNotFoundPage } from '../../../helpers/router'
import BaseSectionLoading from './BaseSectionLoading.vue'
import { setTabError } from './сomposables/tabs'
import { generateEntityUrl } from './сomposables/entity'

const props = withDefaults(defineProps<{
  withReadAction?: boolean
  config?: BaseSectionConfig
  pageType?: PageType
  useEntity: Function
  localEntityData?: Record<string, unknown>
  entityId?: string
}>(),
{
  useEntity: undefined,
  withReadAction: true,
  config: () => new BaseSectionConfig({}),
  pageType: PageType.Create,
},
)

const emits = defineEmits<{
  (event: 'on-cancel'): void
  (event: 'on-save'): void
}>()

const modal = inject('modal')
const store = useStore()
const route = useRoute()
const router = useRouter()

const redirectToNotFoundPage = useRedirectToNotFoundPage(router)

const entityId: string = props.entityId || route.params?.id?.toString()
const isCreatePage: boolean = props.pageType === PageType.Create
const isUpdatePage: boolean = props.pageType === PageType.Update

const { entityName, pageName, EntityFormClass, onSubmitCallback, onBeforeSubmitCb, onSerializeFormCb, validationErrorCb }
  = props.useEntity()

const formRef = ref(null)
const ListPageName: string = pageName ? `${pageName}List` : `${entityName}List`
const UpdatePageName: string = pageName ? `${pageName}Update` : `${entityName}Update`
const entityUrl = generateEntityUrl(entityName)

const isExistsListPage = checkExistsPage(ListPageName)

// Action names
const moduleName: string = props.config?.withCustomModuleName
  ? props.config?.customModuleName || convertLowerCaseFirstSymbol(entityName)
  : 'baseStoreCore'

const createActionName = `${moduleName}/createEntity`
const readActionName = `${moduleName}/readEntity`
const updateActionName = `${moduleName}/updateEntity`
const deleteActionName = `${moduleName}/deleteEntity`

// Permissions
const { canCreateSeo, canUpdate, canUpdateSeo, canRemove, canViewSeo }
  = basePermissions<BaseSectionConfig>({ entityName, config: props.config })

const isLoadingPage = computed(() => store.getters.isLoadingEndpoint([
  `${entityUrl}/create`,
  `${entityUrl}/read`,
  `${entityUrl}/update`,
  `${entityUrl}/delete`,
]))

const isDisableSubmitBtn = computed(() => {
  return store.getters.isLoadingEndpoint(props.config.loadingEndpointArr)
})

const isExistsEndpointsWithError = computed(() => store.getters.isErrorEndpoint([
  `${entityUrl}/read`,
  ...props.config.loadingEndpointArr,
]))

const form = ref()

if (props.withReadAction && entityId) {
  onBeforeMount(async () => {
    try {
      const receivedEntity = await store.dispatch(readActionName, {
        type: entityName,
        id: entityId,
        customApiPrefix: props.config?.customApiPrefix,
      })

      if (isCreatePage) {
        receivedEntity.id = null
        await router.replace({ name: route.name, params: { id: '' } })
      }

      await store.dispatch('textEditor/setVariableTextBuffer', receivedEntity.localisationParameters)
      form.value = new EntityFormClass(receivedEntity)
    }
    catch (error) {
      await redirectToNotFoundPage(error.type)
    }
  })
}

else if (props.localEntityData) {
  form.value = new EntityFormClass(props.localEntityData)
}

else {
  form.value = new EntityFormClass()
}

const validate = async () => {
  const { valid } = await formRef.value.validate()

  const errors = formRef.value.getErrors()

  const [fieldName] = Object.keys(errors).filter(
    nameField => errors[nameField].isNotEmpty,
  )

  if (fieldName)
    setTabError(fieldName, form)

  return valid
}

const isDisableSubmit = computed(() => [isLoadingPage.value, isDisableSubmitBtn.value, isExistsEndpointsWithError.value].some(Boolean))

// Handlers
const transformedForm = ref({})
const actionName = computed(() => isCreatePage ? createActionName : updateActionName)
const isStaySubmit = ref(false)

const isUpdateSeoOnly = computed(
  () => isUpdatePage && canCreateSeo && canUpdateSeo && !canUpdate,
)

const isCreateOrUpdateSeo = computed(
  () => (isCreatePage && canCreateSeo) || (isUpdatePage && canUpdateSeo),
)

const isShowSaveBtn = computed<boolean>(() => isUpdatePage && (canUpdate || canUpdateSeo))
const isReadMode = computed<boolean>(() => isUpdatePage && !canUpdate && !canUpdateSeo)

const onSubmit = async (isStay: boolean) => {
  if (!(await validate()) || isExistsEndpointsWithError.value)
    return
  isStaySubmit.value = isStay

  const formData = isUpdateSeoOnly.value
    ? {
      id: form.value.id,
      seo: form.value.seo,
      fieldTranslations: form.value.fieldTranslations,
      localisationParameters: form.value.localisationParameters,
    }
    : {
      ...form.value,
      seo: isCreateOrUpdateSeo.value || props.config.ignoreSeoPermission ? form.value.seo : null,
      fieldTranslations: isCreateOrUpdateSeo.value || props.config.ignoreSeoPermission ? form.value.fieldTranslations : null,
      localisationParameters: isCreateOrUpdateSeo.value || props.config.ignoreSeoPermission
        ? form.value.localisationParameters
        : null,
    }

  const transformedData = transformFormData(formData)

  transformedForm.value = onSerializeFormCb ? onSerializeFormCb(transformedData, form) : transformedData

  if (onBeforeSubmitCb && !onBeforeSubmitCb(formData))
    return

  await onSave()
}

const redirectToListOrPrevPage = () => {
  if (props.config.backToTheHistoryLast && router.options.history.state.back)
    return router.go(-1)

  return router.push({ name: ListPageName })
}

const onSave = async () => {
  modal.hideModal(ModalsId.ConfirmModal)
  try {
    const data = await store.dispatch(actionName.value, {
      type: entityName,
      data: {
        form: transformedForm.value,
        formRef: { ...formRef.value, validationErrorCb },
      },
      customApiPrefix: props.config?.customApiPrefix,
    })

    if (props.config.isModalSection)
      return emits('on-save')

    if (isCreatePage) {
      isStaySubmit.value && data
        ? await router.push({ name: UpdatePageName, params: { id: String(data?.id) } })
        : await router.push({ name: ListPageName })
    }

    if (isUpdatePage)
      redirectToListOrPrevPage()

    if (onSubmitCallback)
      await onSubmitCallback(String(transformedForm.value?.id))
  }
  catch (e) {
    if (e?.validationErrors?.[0])
      setTabError(e.validationErrors[0]?.field, form)
  }
}

const onClickCancel = () => {
  if (props.config.isModalSection)
    return emits('on-cancel')
  redirectToListOrPrevPage()
}

const removeModalId = 'form-item-remove-modal'

// Remove
const onClickRemove = async () => {
  modal.showModal(removeModalId)
}

const confirmRemoveModal = async () => {
  modal.hideModal(removeModalId)
  await store.dispatch(deleteActionName, {
    type: entityName,
    id: entityId,
    customApiPrefix: props.config?.customApiPrefix,
  })

  await router.push({ name: ListPageName })
}

watch(() => formRef.value?.values, () => {
  store.dispatch('resetErrorUrls')
}, { deep: true })

onBeforeUnmount(() => {
  store.dispatch('resetErrorUrls')
  store.dispatch('textEditor/setVariableTextBuffer', {})
})

defineExpose({
  form,
  validate,
  formRef,
})
</script>

<template>
  <BaseSectionLoading :loading="isLoadingPage">
    <template #default>
      <VAlert
        v-if="isReadMode"
        :icon="IconsList.EyeIcon"
        :variant="VVariants.Tonal"
        class="mb-6 px-4 py-2 font-weight-bolder"
        :color="VColors.Info"
        :text="$t('component.baseSection.readModeAlert')"
      />

      <Form
        v-if="form"
        ref="formRef"
        class="base-section"
        data-test-id="base-section"
        @submit.prevent
      >
        <div class="position-relative">
          <slot
            :entity-id="entityId"
            :entity-name="entityName"
            :form="form"
            :can-update="canUpdate"
            :can-remove="canRemove"
            :can-view-seo="canViewSeo"
            :can-create-seo="canCreateSeo"
            :can-update-seo="canUpdateSeo"
            :on-click-remove="onClickRemove"
          />
          <div
            v-if="isLoadingPage && pageType"
            class="position-absolute base-section__loading d-flex"
            data-test-id="loading"
          >
            <VProgressCircular
              indeterminate
              class="ma-auto"
            />
          </div>
        </div>
        <slot
          v-if="pageType"
          name="actions"
          :form="form"
          :loading="isLoadingPage"
        >
          <hr
            v-if="config.isModalSection"
            class="mt-5"
          >
          <div
            class="d-flex align-center mt-5"
            :class="{ 'px-2 mt-4 mb-4 flex-row-reverse gap-4': config.isModalSection }"
          >
            <template v-if="isCreatePage">
              <VBtn
                class="mr-4"
                :color="VColors.Primary"
                data-test-id="create-button"
                :disabled="isLoadingPage"
                @click="onSubmit(false)"
              >
                {{ $t('action.createAndExit') }}
              </VBtn>

              <VBtn
                class="mr-4"
                :variant="VVariants.Outlined"
                :color="VColors.Secondary"
                data-test-id="stay-button"
                :disabled="isLoadingPage"
                @click="onSubmit(true)"
              >
                {{ $t('action.createAndStay') }}
              </VBtn>
            </template>

            <VBtn
              v-if="isShowSaveBtn"
              class="mr-4"
              :color="VColors.Primary"
              data-test-id="save-button"
              :disabled="isDisableSubmit || isLoadingPage"
              @click="onSubmit(false)"
            >
              {{ $t('action.save') }}
            </VBtn>

            <VBtn
              v-if="isExistsListPage || props.config.backToTheHistoryLast"
              :variant="VVariants.Outlined"
              :color="VColors.Secondary"
              data-test-id="cancel-button"
              @click.prevent="onClickCancel"
            >
              {{ $t('action.cancel') }}
            </VBtn>
          </div>
        </slot>

        <ConfirmModal
          v-if="!config?.withoutConfirmModal"
          :modal-id="ModalsId.ConfirmModal"
          @on-click-modal-ok="onSave"
        />
        <RemoveModal
          v-if="!config?.withoutDeleteModal"
          :remove-modal-id="removeModalId"
          :entity-name="entityName"
          data-test-id="remove-modal"
          @on-click-modal-ok="confirmRemoveModal"
        />
      </Form>
    </template>
  </BaseSectionLoading>
</template>
