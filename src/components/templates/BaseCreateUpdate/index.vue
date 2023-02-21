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

      <div class="d-flex align-items-center">
        <template v-if="isCreatePage">
          <b-button class="mr-2" variant="primary" @click="onSubmit(false)">
            {{ $t('action.createAndExit') }}
          </b-button>

          <b-button class="mr-2" variant="outline-secondary" @click="onSubmit(true)">
            {{ $t('action.createAndStay') }}
          </b-button>
        </template>

        <template v-if="isUpdatePage">
          <b-button class="mr-2" variant="primary" @click="onSubmit(false)">
            {{ $t('action.save') }}
          </b-button>
        </template>

        <b-button variant="outline-secondary" @click.prevent="onClickCancel">
          {{ $t('action.cancel') }}
        </b-button>
      </div>
    </b-form>
  </validation-observer>
</template>

<script lang="ts">
import { getCurrentInstance, PropType, ref, computed, onBeforeMount } from 'vue'
import { getters, dispatch } from '@/store'
import { PageType, UseEntityType } from './model'
import { ValidationObserver } from 'vee-validate'
import formValidation from '@core/comp-functions/forms/form-validation'
import CardLoader from '@core/components/card-loader/CardLoader.vue'
import { convertCamelCase, convertLowerCaseFirstSymbol, transformFormData } from '@/helpers'
import { useBvModal } from '@/helpers/bvModal'
import { useUtils as useI18nUtils } from '@core/libs/i18n'
import { useRouter } from '@core/utils/utils'
import { BaseListConfig, IBaseListConfig } from '@/components/templates/BaseList/model'

export default {
  name: 'BaseCreateUpdate',
  components: {
    ValidationObserver,
    CardLoader,
  },

  props: {
    config: {
      type: Object as PropType<IBaseListConfig>,
      default: () => new BaseListConfig({}),
    },

    pageType: {
      type: String as PropType<PageType>,
      required: true,
    },

    useEntity: {
      type: Function as PropType<() => UseEntityType>,
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

    const { entityName, pageName, EntityFormClass } = props.useEntity()

    const ListPageName: string = pageName ? `${pageName}List` : `${entityName}List`
    const UpdatePageName: string = pageName ? `${pageName}Update` : `${entityName}Update`

    // Action names
    const moduleName: string = convertLowerCaseFirstSymbol(entityName)
    const createActionName: string = 'baseStore/createEntity'
    const readActionName: string = 'baseStore/readEntity'
    const updateActionName: string = 'baseStore/updateEntity'
    const deleteActionName: string = 'baseStore/deleteEntity'

    // Permissions
    const permissionKey: string = `backoffice-${convertCamelCase(entityName, '-')}`
    const permissionKeySeo: string = `backoffice-${convertCamelCase(entityName, '-')}-seo`

    const onePermission: boolean = getters.abilityCan(props.config?.onePermissionKey, 'view')

    const canUpdate: boolean = props.config?.onePermissionKey
      ? onePermission
      : getters.abilityCan(permissionKey, 'update')
    const canRemove: boolean = props.config?.onePermissionKey
      ? onePermission
      : getters.abilityCan(permissionKey, 'delete')
    const canViewSeo: boolean = props.config?.onePermissionKey
      ? onePermission
      : getters.abilityCan(permissionKeySeo, 'view')
    const canCreateSeo: boolean = props.config?.onePermissionKey
      ? onePermission
      : getters.abilityCan(permissionKeySeo, 'create')
    const canUpdateSeo: boolean = props.config?.onePermissionKey
      ? onePermission
      : getters.abilityCan(permissionKeySeo, 'update')

    const isLoadingPage = computed(() => {
      const entityUrl = convertCamelCase(entityName, '/')

      return getters.isLoadingEndpoint([
        `${entityUrl}/create`,
        `${entityUrl}/read`,
        `${entityUrl}/update`,
        `${entityUrl}/delete`,
      ])
    })

    const form = ref(new EntityFormClass())

    if (isUpdatePage && entityId) {
      onBeforeMount(async () => {
        const receivedEntity = await dispatch(readActionName, { type: entityName, id: entityId })

        form.value = new EntityFormClass(receivedEntity)
      })
    }

    const { refFormObserver } = formValidation(() => {
      form.value = new EntityFormClass()
    })

    // Handlers
    const onSubmit = async (isStay: boolean) => {
      const isValid: boolean = await refFormObserver.value.validate()
      if (!isValid) return

      const actionName: string = isCreatePage ? createActionName : updateActionName
      const transformedForm = transformFormData(form.value)

      const data = await dispatch(actionName, {
        type: entityName,
        data: {
          form: transformedForm,
          formRef: refFormObserver.value,
        },
      })

      if (isCreatePage) {
        isStay
          ? await router.push({ name: UpdatePageName, params: { id: String(data?.id) } })
          : await router.push({ name: ListPageName })
      }
    }

    const onClickCancel = () => router.push({ name: ListPageName })

    // Remove
    const onClickRemove = async (id: string) => {
      const isRemoveConfirmed = await confirmRemoveModal()

      if (!isRemoveConfirmed) return

      await dispatch(deleteActionName, { type: entityName, id })

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

    return {
      entityId,
      isCreatePage,
      isUpdatePage,
      isLoadingPage,
      refFormObserver,
      form,

      // Permissions
      canUpdate,
      canRemove,
      canViewSeo,
      canCreateSeo,
      canUpdateSeo,

      // Handlers
      onSubmit,
      onClickCancel,
      onClickRemove,
    }
  },
}
</script>
