<script setup lang="ts">
import { computed, inject, nextTick, onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form } from 'vee-validate'
import store from '../../../store'
import { convertCamelCase, convertLowerCaseFirstSymbol, transformFormData } from '../../../helpers'
import { basePermissions } from '../../../helpers/base-permissions'
import { PageType } from '../../../@model/templates/baseSection'
import { BaseSectionConfig } from '../../../@model/templates/baseList'
import { VColors, VVariants } from '../../../@model/vuetify'
import RemoveModal from '../../../components/BaseModal/RemoveModal.vue'

const props = withDefaults(defineProps<{
  withReadAction?: boolean
  config?: BaseSectionConfig
  pageType?: PageType
  useEntity: Function
}>(),
{
  useEntity: undefined,
  withReadAction: true,
  config: () => new BaseSectionConfig({}),
  pageType: PageType.Create,
},
)

const modal = inject('modal')

const route = useRoute()
const router = useRouter()

const entityId: string = route.params?.id?.toString()
const isCreatePage: boolean = props.pageType === PageType.Create
const isUpdatePage: boolean = props.pageType === PageType.Update

const tabNameError = ref('')
const fieldNameError = ref('')

const { entityName, pageName, EntityFormClass, onSubmitCallback, onBeforeSubmitCb }
    = props.useEntity()

const formRef = ref(null)
const ListPageName: string = pageName ? `${pageName}List` : `${entityName}List`
const UpdatePageName: string = pageName ? `${pageName}Update` : `${entityName}Update`

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

const generateEntityUrl = () => {
  const indexSymbolNextDash = entityName.indexOf('-') + 1

  const entityNameForLoad = entityName.replace(
    entityName[indexSymbolNextDash],
    entityName[indexSymbolNextDash].toLowerCase(),
  )

  return convertCamelCase(entityNameForLoad, '/')
}

const isLoadingPage = computed(() => {
  const entityUrl = generateEntityUrl()

  return store.getters.isLoadingEndpoint([
    `${entityUrl}/create`,
    `${entityUrl}/read`,
    `${entityUrl}/update`,
    `${entityUrl}/delete`,
  ])
})

const isDisableSubmitBtn = computed(() => {
  return store.getters.isLoadingEndpoint(props.config.loadingEndpointArr)
})

const isExistsEndpointsWithError = computed(() => {
  const entityUrl = generateEntityUrl()

  return store.getters.isErrorEndpoint([
    `${entityUrl}/read`,
    ...props.config.loadingEndpointArr,
  ])
})

const form = ref()

if (props.withReadAction && entityId) {
  onBeforeMount(async () => {
    const receivedEntity = await store.dispatch(readActionName, {
      type: entityName,
      id: entityId,
      customApiPrefix: props.config?.customApiPrefix,
    })

    if (isCreatePage) {
      receivedEntity.id = null
      await router.push({ name: route.name, params: { id: null }, replace: true })
    }

    await store.dispatch('textEditor/setVariableTextBuffer', receivedEntity.localisationParameters)
    form.value = new EntityFormClass(receivedEntity)
  })
}
else {
  form.value = new EntityFormClass()
}

const validate = async () => {
  const { valid } = await formRef.value.validate()

  const errors = formRef.value.getErrors()

  const fieldsNotValid = Object.keys(errors).filter(
    nameField => errors[nameField].isNotEmpty,
  )

  if (fieldsNotValid[0])
    setTabError(fieldsNotValid[0])

  return valid
}

const setTabError = (fieldName: string) => {
  fieldNameError.value = fieldName
  tabNameError.value = ''
  if (form.value.hasOwnProperty(fieldName))
    tabNameError.value = 'main'
  else if (form.value.seo?.hasOwnProperty(fieldName))
    tabNameError.value = 'seo'
  else if (form.value.fieldTranslations?.hasOwnProperty(fieldName))
    tabNameError.value = 'localization'

  if (tabNameError.value) {
    const tabElement: HTMLElement | null = document.querySelector(
      `button[value=${tabNameError.value}]`,
    )

    if (tabElement)
      tabElement.click()
  }

  if (fieldNameError.value) {
    nextTick(() => {
      const el: HTMLElement | null = document.getElementById(`${fieldNameError.value}-field`)
      if (el) {
        el.scrollIntoView({
          block: 'start',
        })
      }
    })
  }
}

const isUpdateSeoOnly = computed(
  () => isUpdatePage && canCreateSeo && canUpdateSeo && !canUpdate,
)

const isDisableSubmit = computed(() => [isLoadingPage.value, isDisableSubmitBtn.value, isExistsEndpointsWithError.value].some(Boolean))

// Handlers
const onSubmit = async (isStay: boolean) => {
  if (!(await validate()) || isExistsEndpointsWithError.value)
    return

  const actionName: string = isCreatePage ? createActionName : updateActionName

  const formData = isUpdateSeoOnly.value
    ? {
        id: form.value.id,
        seo: form.value.seo,
        fieldTranslations: form.value.fieldTranslations,
        localisationParameters: form.value.localisationParameters,
      }
    : form.value

  const transformedForm: any = transformFormData(formData)
  if (onBeforeSubmitCb && !(await onBeforeSubmitCb(formData)))
    return

  try {
    const data = await store.dispatch(actionName, {
      type: entityName,
      data: {
        form: transformedForm,

        // formRef: refFormObserver.value,
      },
      customApiPrefix: props.config?.customApiPrefix,
    })

    if (isCreatePage) {
      isStay && data
        ? await router.push({ name: UpdatePageName, params: { id: String(data?.id) } })
        : await router.push({ name: ListPageName })
    }

    if (onSubmitCallback)
      await onSubmitCallback(String(transformedForm?.id))
  }
  catch (e) {
    if (e?.validationErrors?.[0])
      setTabError(e.validationErrors[0]?.field)
  }
}

const onClickCancel = () => router.push({ name: ListPageName })
const removeModalId = 'list-item-remove-modal'

// Remove
const onClickRemove = async () => {
  modal.showModal(removeModalId)
}

const confirmRemoveModal = async () => {
  await store.dispatch(deleteActionName, {
    type: entityName,
    id: entityId,
    customApiPrefix: props.config?.customApiPrefix,
  })

  await router.push({ name: ListPageName })
}

onBeforeUnmount(() => {
  store.dispatch('resetErrorUrls')
})
</script>

<template>
  <Form
    v-if="form"
    ref="formRef"
    @submit.prevent
  >
    <slot
      :entity-id="entityId"
      :form="form"
      :can-update="canUpdate"
      :can-remove="canRemove"
      :can-view-seo="canViewSeo"
      :can-create-seo="canCreateSeo"
      :can-update-seo="canUpdateSeo"
      :on-click-remove="onClickRemove"
    />

    <slot
      v-if="pageType"
      name="actions"
      :form="form"
    >
      <div class="d-flex align-center mt-5">
        <template v-if="isCreatePage">
          <VBtn
            class="mr-4"
            :color="VColors.Primary"
            data-testid="create-button"
            @click="onSubmit(false)"
          >
            {{ $t('action.createAndExit') }}
          </VBtn>

          <VBtn
            class="mr-4"
            :variant="VVariants.Outlined"
            :color="VColors.Secondary"
            data-testid="stay-button"
            @click="onSubmit(true)"
          >
            {{ $t('action.createAndStay') }}
          </VBtn>
        </template>

        <template v-if="isUpdatePage">
          <VBtn
            class="mr-4"
            :color="VColors.Primary"
            data-testid="save-button"
            :disabled="isDisableSubmit"
            @click="onSubmit(false)"
          >
            {{ $t('action.save') }}
          </VBtn>
        </template>

        <VBtn
          :variant="VVariants.Outlined"
          :color="VColors.Error"
          data-testid="cancel-button"
          @click.prevent="onClickCancel"
        >
          {{ $t('action.cancel') }}
        </VBtn>
      </div>
    </slot>

    <RemoveModal
      :remove-modal-id="removeModalId"
      :entity-name="entityName"
      @on-click-modal-ok="confirmRemoveModal"
    />
  </Form>
</template>
