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
      </slot>
    </b-form>
  </validation-observer>
</template>

<script lang="ts">
import { getCurrentInstance, PropType, ref, computed, onBeforeMount, defineComponent } from 'vue'
import store from '../../../store'
import { PageType, UseEntityType } from './model'
import { ValidationObserver } from 'vee-validate'
import formValidation from '../../../@core/comp-functions/forms/form-validation'
import CardLoader from '../../../@core/components/card-loader/CardLoader.vue'
import { convertCamelCase, convertLowerCaseFirstSymbol, transformFormData } from '../../../helpers'
import { useBvModal } from '../../../helpers/bvModal'
import { useUtils as useI18nUtils } from '../../../@core/libs/i18n'
import { useRouter } from '../../../@core/utils/utils'
import { BaseSectionConfig, IBaseSectionConfig } from '../../../components/templates/BaseList/model'
import { permissionPrefix } from '@productConfig'

export default defineComponent({
  name: 'BaseSection',
  components: {
    ValidationObserver,
    CardLoader,
  },

  props: {
    config: {
      type: Object as PropType<IBaseSectionConfig>,
      default: () => new BaseSectionConfig({}),
    },

    pageType: {
      type: String as PropType<PageType>,
      default: '',
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

    const { entityName, pageName, EntityFormClass, onSubmitCallback } = props.useEntity()

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
    const permissionKey: string = `${permissionPrefix}-${convertCamelCase(entityName, '-')}`
    const permissionKeySeo: string = `${permissionPrefix}-${convertCamelCase(entityName, '-')}-seo`

    const onePermission: boolean = store.getters.abilityCan(props.config?.onePermissionKey, 'view')

    const canUpdate: boolean = props.config?.onePermissionKey
      ? onePermission
      : store.getters.abilityCan(permissionKey, 'update')
    const canRemove: boolean = props.config?.onePermissionKey
      ? onePermission
      : store.getters.abilityCan(permissionKey, 'delete')
    const canViewSeo: boolean = props.config?.onePermissionKey
      ? onePermission
      : store.getters.abilityCan(permissionKeySeo, 'view')
    const canCreateSeo: boolean = props.config?.onePermissionKey
      ? onePermission
      : store.getters.abilityCan(permissionKeySeo, 'create')
    const canUpdateSeo: boolean = props.config?.onePermissionKey
      ? onePermission
      : store.getters.abilityCan(permissionKeySeo, 'update')

    const isLoadingPage = computed(() => {
      const entityUrl = convertCamelCase(entityName, '/')

      return store.getters.isLoadingEndpoint([
        `${entityUrl}/create`,
        `${entityUrl}/read`,
        `${entityUrl}/update`,
        `${entityUrl}/delete`,
      ])
    })

    const form = ref(new EntityFormClass())

    if (isUpdatePage && entityId) {
      onBeforeMount(async () => {
        const receivedEntity = await store.dispatch(readActionName, {
          type: entityName,
          id: entityId,
        })

        form.value = new EntityFormClass(receivedEntity)
      })
    }

    const resetForm = () => {
      form.value = new EntityFormClass()
    }
    const { refFormObserver } = formValidation(resetForm)
    const validate = async () => {
      return await refFormObserver.value.validate()
    }

    // Handlers
    const onSubmit = async (isStay: boolean) => {
      if (!(await validate())) return

      const actionName: string = isCreatePage ? createActionName : updateActionName
      const transformedForm = transformFormData(form.value)

      const data = await store.dispatch(actionName, {
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

      if (onSubmitCallback) await onSubmitCallback(String(transformedForm?.id))
    }

    const onClickCancel = () => router.push({ name: ListPageName })

    // Remove
    const onClickRemove = async (id: string) => {
      const isRemoveConfirmed = await confirmRemoveModal()

      if (!isRemoveConfirmed) return

      await store.dispatch(deleteActionName, { type: entityName, id })

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
