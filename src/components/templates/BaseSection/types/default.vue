<script setup lang="ts">
import { computed, inject, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form } from 'vee-validate'
import { omit } from 'lodash'
import { IconsList } from '../../../../@model/enums/icons'
import { checkExistsPage, transformFormData } from '../../../../helpers'
import { basePermissions } from '../../../../helpers/base-permissions'
import { BaseSectionSlots, PageType } from '../../../../@model/templates/baseSection'
import { BaseSectionConfig } from '../../../../@model/templates/baseList'
import { VColors, VVariants } from '../../../../@model/vuetify'
import RemoveModal from '../../../../components/BaseModal/RemoveModal.vue'
import ConfirmModal from '../../../../components/BaseModal/ConfirmModal.vue'
import { ModalsId } from '../../../../@model/modalsId'
import { useRedirectToNotFoundPage } from '../../../../helpers/router'
import { useLoaderStore } from '../../../../stores/loader'
import { useTextEditorStore } from '../../../../stores/textEditor'
import { useBaseStoreCore } from '../../../../stores/baseStoreCore'
import { setTabError } from '../composables/tabs'
import { generateEntityUrl } from '../composables/entity'
import BaseSectionLoading from '../BaseSectionLoading.vue'
import { useBaseSectionErrorsStore } from '../../../../stores/baseSectionErrors'
import { useAppConfigCoreStore } from '../../../../stores/appConfigCore'
import { useUserStore } from '../../../../stores/user'
import { SelectBaseField } from '../../../../@model/templates/baseField'
import type { OptionsItem } from '../../../../@model'
import SelectField from '../../../../components/templates/FieldGenerator/_components/SelectField.vue'
import type { ProjectInfo } from '../../../../@model/project'

defineOptions({
  name: 'DefaultBaseSection',
})

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
const loaderStore = useLoaderStore()
const baseSectionErrorStore = useBaseSectionErrorsStore()
const route = useRoute()
const router = useRouter()
const textEditorStore = useTextEditorStore()
const appConfigCoreStore = useAppConfigCoreStore()
const userStore = useUserStore()

const redirectToNotFoundPage = useRedirectToNotFoundPage(router)

const entityId: string = props.entityId || route.params?.id?.toString()
const isRootPage: boolean = props.pageType === PageType.Root
const isCreatePage: boolean = props.pageType === PageType.Create
const isUpdatePage: boolean = props.pageType === PageType.Update
const isModal = props.config?.isModalSection

const {
  useStore,
  entityName,
  pageName,
  EntityFormClass,
  onSubmitCallback,
  onBeforeSubmitCb,
  onSerializeFormCb,
  onReceiveEntity,
  validationErrorCb,
}
  = props.useEntity()

const formRef = ref(null)
const ListPageName: string = pageName ? `${pageName}List` : `${entityName}List`
const CreatePageName: string = pageName ? `${pageName}Create` : `${entityName}Create`
const UpdatePageName: string = pageName ? `${pageName}Update` : `${entityName}Update`
const entityUrl = generateEntityUrl(entityName)

const isExistsListPage = checkExistsPage(ListPageName)

const actualStore = useStore ? useStore() : useBaseStoreCore()

// Actions

const actionCreate = actualStore.createEntity
const actionUpdate = actualStore.updateEntity
const actionRead = actualStore.readEntity
const actionDelete = actualStore.deleteEntity

// Permissions
const { canCreateSeo, canUpdate, canUpdateSeo, canRemove, canViewSeo }
  = basePermissions<BaseSectionConfig>({ entityName, config: props.config })

const isLoadingPage = computed(() => loaderStore.isLoadingEndpoint([
  `${entityUrl}/create`,
  `${entityUrl}/read`,
  `${entityUrl}/update`,
  `${entityUrl}/delete`,
]))

const isDisableSubmitBtn = computed(() => {
  return loaderStore.isLoadingEndpoint(props.config.loadingEndpointArr)
})

const isExistsEndpointsWithError = computed(() => baseSectionErrorStore.isErrorEndpoint([
  `${entityUrl}/read`,
  ...props.config.loadingEndpointArr,
]))

const form = ref()

const onFetchFormData = async (projectAlias?: string) => {
  try {
    const { forProject, fromProject } = route?.query || { fromProject: '', forProject: '' }

    const receivedEntity = await actionRead({
      type: entityName,
      id: entityId,
      customApiPrefix: props.config?.customApiPrefix,
      project: fromProject || projectAlias,
    })

    if (onReceiveEntity) {
      const isForAnotherProject = forProject && fromProject && forProject !== fromProject

      await onReceiveEntity({
        ...receivedEntity,
        id: entityId,
      }, isForAnotherProject)
    }

    if (isCreatePage) {
      receivedEntity.id = null

      const query = forProject || fromProject ? omit(route.query, ['forProject', 'fromProject']) : route.query

      await router.replace({
        name: route.name,
        params: { id: '' },
        query,
      })
    }

    textEditorStore.setVariableTextBuffer(receivedEntity.localisationParameters)
    form.value = new EntityFormClass(receivedEntity)
  }
  catch (error) {
    await redirectToNotFoundPage(error.type)
  }
}

if (props.withReadAction && (entityId || isRootPage))
  onBeforeMount(onFetchFormData)

else if (props.localEntityData)
  form.value = new EntityFormClass(props.localEntityData)

else
  form.value = new EntityFormClass()

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
const baseSectionAction = computed(() => isCreatePage ? actionCreate : actionUpdate)
const isStaySubmit = ref(false)

const isUpdateSeoOnly = computed(
  () => isUpdatePage && canCreateSeo && canUpdateSeo && !canUpdate,
)

const isCreateOrUpdateSeo = computed(
  () => (isCreatePage && canCreateSeo) || (isUpdatePage && canUpdateSeo),
)

const isShowSaveBtn = computed<boolean>(() => isUpdatePage && (canUpdate || canUpdateSeo))
const isReadMode = computed<boolean>(() => (isUpdatePage || isRootPage) && !canUpdate && !canUpdateSeo)

const onSubmit = async (isStay: boolean) => {
  textEditorStore.setSave(true)

  if (!(await validate()) || isExistsEndpointsWithError.value)
    return
  isStaySubmit.value = isStay

  const project = props.config?.projectFilter ? projectFilter.value.value?.alias : undefined

  const hasSeo = 'seo' in form.value
  const hasFieldTranslations = 'fieldTranslations' in form.value
  const hasLocalisationParameters = 'localisationParameters' in form.value

  const canSendSeo = isCreateOrUpdateSeo.value || props.config.ignoreSeoPermission

  const formData = isUpdateSeoOnly.value
    ? {
      id: form.value.id,
      project,
      seo: form.value.seo,
      fieldTranslations: form.value.fieldTranslations,
      localisationParameters: form.value.localisationParameters,
    }
    : {
      project,
      ...form.value,
      ...(hasSeo && { seo: canSendSeo ? form.value.seo : null }),
      ...(hasFieldTranslations && { fieldTranslations: canSendSeo ? form.value.fieldTranslations : null }),
      ...(hasLocalisationParameters && {
        localisationParameters: canSendSeo ? form.value.localisationParameters : null,
      }),
    }

  const transformedData = transformFormData(formData)

  transformedForm.value = onSerializeFormCb ? onSerializeFormCb(transformedData, form) : transformedData

  if (onBeforeSubmitCb && !onBeforeSubmitCb(formData))
    return

  await onSave(isStay)
}

const redirectToListOrPrevPage = () => {
  const cleanPath = (path = '') => path?.replaceAll('/', '').toUpperCase() || ''
  const backRoute = router.options.history.state.back

  if (props.config.backToTheHistoryLast && backRoute) {
    const createPagePath = cleanPath(generateEntityUrl(CreatePageName))
    const step = isUpdatePage && typeof backRoute === 'string' && cleanPath(backRoute).includes(createPagePath) ? -2 : -1

    return router.go(step)
  }

  return router.push({ name: ListPageName })
}

const onSave = async (isStay?: boolean) => {
  modal.hideModal(ModalsId.ConfirmModal)
  try {
    const data = await baseSectionAction.value({
      type: entityName,
      data: {
        form: transformedForm.value,
        formRef: { ...formRef.value, validationErrorCb },
      },
      customApiPrefix: props.config?.customApiPrefix,
    })

    if (isModal)
      return emits('on-save')

    if (isCreatePage) {
      isStaySubmit.value && data
        ? await router.push({ name: UpdatePageName, params: { id: String(data?.id) } })
        : redirectToListOrPrevPage()
    }

    if (isUpdatePage && !isStay)
      redirectToListOrPrevPage()

    if (onSubmitCallback)
      await onSubmitCallback(String(transformedForm.value?.id))

    if (props.config?.initializeWithUpdate && isStay && isUpdatePage)
      await onFetchFormData()
  }
  catch (e) {
    console.error(e)
    if (e?.validationErrors?.[0])
      setTabError(e.validationErrors[0]?.field, form)
  }
}

const onClickCancel = () => {
  if (isModal)
    return emits('on-cancel')
  redirectToListOrPrevPage()
}

const removeModalId = `form-item-remove-modal-${entityName}`

// Remove
const onClickRemove = async () => {
  modal.showModal(removeModalId)
}

const confirmRemoveModal = async () => {
  modal.hideModal(removeModalId)
  await actionDelete({
    type: entityName,
    id: entityId,
    customApiPrefix: props.config?.customApiPrefix,
  })

  await router.push({ name: ListPageName })
}

watch(() => formRef.value?.values, () => {
  baseSectionErrorStore.resetErrorUrls()
}, { deep: true })

// Project filter
const projectFilter = ref(new SelectBaseField<OptionsItem>({
  key: 'projectFilter',
  value: userStore.getSelectedProject,
  options: appConfigCoreStore.verifiedProjects,
  label: '',
  clearable: false,
}))

watch(() => projectFilter.value.value, ({ alias }: ProjectInfo) => {
  onFetchFormData(alias)
})

onBeforeUnmount(() => {
  baseSectionErrorStore.resetErrorUrls()
  textEditorStore.setVariableTextBuffer({})
})

defineExpose({
  form,
  validate,
  formRef,
})
</script>

<template>
  <div data-test-id="base-section-default">
    <BaseSectionLoading
      :loading="isLoadingPage || isDisableSubmitBtn"
      :fullscreen-background="!config.isModalSection"
    >
      <template #default>
        <VAlert
          v-if="isReadMode"
          :icon="IconsList.EyeIcon"
          :variant="VVariants.Tonal"
          class="mb-6 px-4 py-2 font-weight-bolder"
          :color="VColors.Info"
          :text="$t('component.baseSection.readModeAlert')"
        />

        <SelectField
          v-if="config?.projectFilter"
          v-model="projectFilter.value"
          :field="projectFilter"
          class="project-filter mb-6"
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
          </div>
          <slot
            v-if="pageType"
            :name="BaseSectionSlots.Actions"
            :form="form"
            :loading="isLoadingPage"
            :cancel="onClickCancel"
            :submit="onSubmit"
            :can-update="canUpdate"
          >
            <hr
              v-if="config.isModalSection"
              class="mt-5"
            >
            <div
              class="d-flex align-center mt-6"
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

              <template v-if="isShowSaveBtn">
                <VBtn
                  class="mr-4"
                  :color="VColors.Primary"
                  data-test-id="saveAndExit-button"
                  :disabled="isDisableSubmit || isLoadingPage"
                  @click="onSubmit(false)"
                >
                  {{ isModal ? $t('action.save') : $t('action.saveAndExit') }}
                </VBtn>
                <VBtn
                  v-if="!isModal"
                  class="mr-4"
                  :color="VColors.Secondary"
                  :variant="VVariants.Outlined"
                  data-test-id="saveAndStay-button"
                  :disabled="isDisableSubmit || isLoadingPage"
                  @click="onSubmit(true)"
                >
                  {{ $t('action.saveAndStay') }}
                </VBtn>
              </template>

              <VBtn
                v-if="isExistsListPage || props.config.backToTheHistoryLast"
                :variant="VVariants.Outlined"
                :color="VColors.Secondary"
                data-test-id="cancel-button"
                @click.prevent="onClickCancel"
              >
                {{ $t('action.cancel') }}
              </VBtn>

              <VBtn
                v-if="isRootPage && canUpdate"
                :color="VColors.Primary"
                data-test-id="save-button"
                :disabled="isLoadingPage"
                @click="onSubmit(false)"
              >
                {{ $t('action.save') }}
              </VBtn>
            </div>
          </slot>

          <ConfirmModal
            v-if="!config?.withoutConfirmModal"
            :modal-id="ModalsId.ConfirmModal"
            @on-click-modal-ok="onSave(isStaySubmit)"
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
  </div>
</template>

<style lang="scss" scoped>
.project-filter {
  width: 265px;
}
</style>
