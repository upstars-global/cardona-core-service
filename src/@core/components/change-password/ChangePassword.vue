<template>
  <validation-observer v-slot="{ invalid }">
    <b-modal
      v-model="isShow"
      cancel-variant="outline-secondary"
      :ok-title="$t('action.save')"
      :ok-disabled="invalid"
      :cancel-title="$t('action.cancel')"
      centered
      title="Задать новый пароль"
      @hidden="onCancel"
      @ok="onSuccess"
    >
      <b-form>
        <change-password-input
          v-model="password"
          vid="Password"
          rules="required|password"
          :label="$t('placeholder.newPassword')"
        />
        <change-password-input
          v-model="repeatPassword"
          rules="required|confirmed:Password"
          :label="$t('placeholder.repeatPassword')"
        />
      </b-form>
    </b-modal>
  </validation-observer>
</template>
<script lang="ts">
import { BForm, BModal } from 'bootstrap-vue'
import ChangePasswordInput from './ChangePasswordInput.vue'
import { ref, defineComponent, computed, WritableComputedRef } from 'vue'
import { updateUserPassword } from '@/_@queries/user'
import useToastService from '@/helpers/toasts'

export default defineComponent({
  components: {
    ChangePasswordInput,
    BForm,
    BModal,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { toastSuccess, toastError } = useToastService()

    const isShow: WritableComputedRef<boolean> = computed({
      get() {
        return props.value
      },
      set(value) {
        emit('input', value)
      },
    })

    const password = ref('')
    const repeatPassword = ref('')

    const onCancel = () => {
      password.value = ''
      repeatPassword.value = ''
    }

    const onSuccess = async () => {
      try {
        await updateUserPassword(props.id, {
          password: password.value,
        })

        toastSuccess('Пароль успешно изменён')
      } catch (err) {
        toastError(err)
      }
    }

    return {
      onCancel,
      onSuccess,

      isShow,
      password,
      repeatPassword,
    }
  },
})
</script>
