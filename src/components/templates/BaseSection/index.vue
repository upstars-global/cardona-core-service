<template>
  <validation-observer ref="refFormObserver">
    <b-form>
      <card-loader :show-loading="isLoadingPage">
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
      </card-loader>

      <slot v-if="pageType" name="actions" :form="form">
        <div class="d-flex align-items-center">
          <template v-if="isCreatePage">
            <b-button
              class="mr-2"
              variant="primary"
              data-testid="create-button"
              @click="onSubmit(false)"
            >
              {{ $t('action.createAndExit') }}
            </b-button>

            <b-button
              class="mr-2"
              variant="outline-secondary"
              data-testid="stay-button"
              @click="onSubmit(true)"
            >
              {{ $t('action.createAndStay') }}
            </b-button>
          </template>

          <template v-if="isUpdatePage">
            <b-button
              class="mr-2"
              variant="primary"
              data-testid="save-button"
              :disabled="isLoadingPage || isDisableSubmitBtn || isExistsEndpointsWithError"
              @click="onSubmit(false)"
            >
              {{ $t('action.save') }}
            </b-button>
          </template>

          <b-button
            variant="outline-secondary"
            data-testid="cancel-button"
            @click.prevent="onClickCancel"
          >
            {{ $t('action.cancel') }}
          </b-button>
        </div>
      </slot>
    </b-form>
  </validation-observer>
</template>

<script lang="ts">
import {
  getCurrentInstance,
  PropType,
  ref,
  computed,
  onBeforeMount,
  defineComponent,
  onBeforeUnmount,
  nextTick,
} from 'vue'
import store from '../../../store'
import { PageType, UseEntityType } from './model'
import { ValidationObserver } from 'vee-validate'
import formValidation from '../../../@core/comp-functions/forms/form-validation'
import CardLoader from '../../../@core/components/card-loader/CardLoader.vue'
import { convertCamelCase, convertLowerCaseFirstSymbol, transformFormData } from '../../../helpers'
import { useBvModal } from '../../../helpers/bvModal'
import { useUtils as useI18nUtils } from '../../../@core/libs/i18n'
import { useRouter } from '../../../@core/utils/utils'
import { BaseSectionConfig } from '../BaseList/model'
import { basePermissions } from '../../../helpers/base-permissions'
import { redirectToNotFoundPage } from '../../../helpers/router'

export default defineComponent({
  name: 'BaseSection',
  components: {
    ValidationObserver,
    CardLoader,
  },

  props: {
    withReadAction: {
      type: Boolean,
      default: true,
    },

    config: {
      type: Object as PropType<BaseSectionConfig>,
      default: () => new BaseSectionConfig({}),
    },

    pageType: {
      type: String as PropType<PageType>,
      default: '',
    },

    useEntity: {
      type: Function as PropType<() => UseEntityType<any>>,
      required: true,
    },
  },

  setup(props) {
    const { proxy } = getCurrentInstance() as any
    const bvModal = useBvModal()
    const { t } = useI18nUtils()
    const { route, router } = useRouter()

    const entityId: string = route.value.params.id
    const isCreatePage: boolean = props.pageType === PageType.Create
    const isUpdatePage: boolean = props.pageType === PageType.Update

    const tabNameError = ref('')
    const fieldNameError = ref('')

    const { entityName, pageName, EntityFormClass, onSubmitCallback, onBeforeSubmitCb } =
      props.useEntity()

    const ListPageName: string = pageName ? `${pageName}List` : `${entityName}List`
    const UpdatePageName: string = pageName ? `${pageName}Update` : `${entityName}Update`

    // Action names
    const moduleName: string = props.config?.withCustomModuleName
      ? props.config?.customModuleName || convertLowerCaseFirstSymbol(entityName)
      : 'baseStoreCore'

    const createActionName: string = `${moduleName}/createEntity`
    const readActionName: string = `${moduleName}/readEntity`
    const updateActionName: string = `${moduleName}/updateEntity`
    const deleteActionName: string = `${moduleName}/deleteEntity`

    // Permissions

    const { canCreateSeo, canUpdate, canUpdateSeo, canRemove, canViewSeo } =
      basePermissions<BaseSectionConfig>({ entityName, config: props.config })

    const generateEntityUrl = () => {
      const indexSymbolNextDash = entityName.indexOf('-') + 1
      const entityNameForLoad = entityName.replace(
        entityName[indexSymbolNextDash],
        entityName[indexSymbolNextDash].toLowerCase()
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

    const form = ref(new EntityFormClass())

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
          }

          form.value = new EntityFormClass(receivedEntity)
        } catch (error: any) {
          await redirectToNotFoundPage(error.type)
        }
      })
    }

    const resetForm = () => {
      form.value = new EntityFormClass()
    }
    const { refFormObserver } = formValidation(resetForm)
    const validate = async () => {
      const isValid = await refFormObserver.value.validate()
      const fieldsNotValid = Object.keys(refFormObserver.value.errors).filter(
        (nameField) => refFormObserver.value.errors[nameField].isNotEmpty
      )

      if (fieldsNotValid[0]) {
        setTabError(fieldsNotValid[0])
      }
      return isValid
    }

    const setTabError = (fieldName) => {
      fieldNameError.value = fieldName
      tabNameError.value = ''
      if (form.value.hasOwnProperty(fieldName)) {
        tabNameError.value = 'mainTab'
      } else if (form.value.seo?.hasOwnProperty(fieldName)) {
        tabNameError.value = 'seoTab'
      } else if (form.value.fieldTranslations?.hasOwnProperty(fieldName)) {
        tabNameError.value = 'localizationTab'
      }

      if (tabNameError.value) {
        const tabElement: HTMLElement | null = document.querySelector(
          `a[aria-controls=${tabNameError.value}]`
        )
        if (tabElement) tabElement.click()
      }

      if (fieldNameError.value) {
        nextTick(() => {
          const el: HTMLElement | null = document.getElementById(`${fieldNameError.value}-field`)
          if (el) {
            el.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        })
      }
    }

    const isUpdateSeoOnly = computed(
      () => isUpdatePage && canCreateSeo && canUpdateSeo && !canUpdate
    )
    const isCreateOrUpdateSeo = computed(
      () => (isCreatePage && canCreateSeo) || (isUpdatePage && canUpdateSeo)
    )
    // Handlers
    const onSubmit = async (isStay: boolean) => {
      if (!(await validate()) || isExistsEndpointsWithError.value) return

      const actionName: string = isCreatePage ? createActionName : updateActionName

      const formData = isUpdateSeoOnly.value
        ? {
            id: form.value.id,
            seo: form.value.seo,
            fieldTranslations: form.value.fieldTranslations,
            localisationParameters: form.value.localisationParameters,
          }
        : {
            ...form.value,
            seo:
              isCreateOrUpdateSeo.value || props.config.ignoreSeoPermission ? form.value.seo : null,
            fieldTranslations:
              isCreateOrUpdateSeo.value || props.config.ignoreSeoPermission
                ? form.value.fieldTranslations
                : null,
            localisationParameters:
              isCreateOrUpdateSeo.value || props.config.ignoreSeoPermission
                ? form.value.localisationParameters
                : null,
          }

      const transformedForm: any = transformFormData(formData)
      if (onBeforeSubmitCb && !(await onBeforeSubmitCb(formData))) return

      try {
        const data = await store.dispatch(actionName, {
          type: entityName,
          data: {
            form: transformedForm,
            formRef: refFormObserver.value,
          },
          customApiPrefix: props.config?.customApiPrefix,
        })

        if (isCreatePage) {
          isStay && data
            ? await router.push({ name: UpdatePageName, params: { id: String(data?.id) } })
            : await router.push({ name: ListPageName })
        }

        if (onSubmitCallback) await onSubmitCallback(String(transformedForm?.id))
      } catch (e) {
        if (e?.['validationErrors']?.[0]) {
          setTabError(e['validationErrors'][0]?.field)
        }
        return
      }
    }

    const onClickCancel = () => router.push({ name: ListPageName })

    // Remove
    const onClickRemove = async (id: string) => {
      const isRemoveConfirmed = await confirmRemoveModal()

      if (!isRemoveConfirmed) return

      await store.dispatch(deleteActionName, {
        type: entityName,
        id,
        customApiPrefix: props.config?.customApiPrefix,
      })

      await router.push({ name: ListPageName })
    }

    const confirmRemoveModal = () => {
      return bvModal.msgBoxConfirm(t(`modal.remove${entityName}.description`, proxy), {
        title: t(`modal.remove${entityName}.title`, proxy),
        size: 'sm',
        okVariant: 'danger',
        okTitle: t('action.remove', proxy),
        cancelVariant: 'outline-secondary',
        cancelTitle: t('action.cancel', proxy),
        hideHeaderClose: false,
        centered: true,
      })
    }

    onBeforeUnmount(() => {
      store.dispatch('resetErrorUrls')
    })

    return {
      entityId,
      isCreatePage,
      isUpdatePage,
      isLoadingPage,
      isDisableSubmitBtn,
      isExistsEndpointsWithError,
      refFormObserver,
      form,
      tabNameError,
      fieldNameError,

      // Permissions
      canUpdate,
      canRemove,
      canViewSeo,
      canCreateSeo,
      canUpdateSeo,

      // Validate
      validate,

      // Reset
      resetForm,

      // Handlers
      onSubmit,
      onClickCancel,
      onClickRemove,
    }
  },
})
</script>
