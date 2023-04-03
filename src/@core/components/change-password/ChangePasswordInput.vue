<template>
  <b-form-group :label="label" label-for="login">
    <validation-provider v-slot="{ errors }" :name="label" :vid="vid" :rules="rules">
      <b-input-group class="input-group-merge" :class="errors.isNotEmpty ? 'is-invalid' : null">
        <b-form-input
          :value="value"
          :state="errors.isNotEmpty ? false : null"
          class="form-control-merge"
          :type="passwordFieldType"
          :placeholder="label"
          @input="$emit('input', $event)"
        />
        <b-input-group-append is-text>
          <feather-icon
            class="cursor-pointer"
            :icon="passwordToggleIcon"
            @click="togglePasswordVisibility"
          />
        </b-input-group-append>
      </b-input-group>
      <small class="text-danger">{{ errors[0] }}</small>
    </validation-provider>
  </b-form-group>
</template>
<script lang="ts">
import { BFormGroup, BFormInput, BInputGroupAppend, BInputGroup } from 'bootstrap-vue'
import { togglePasswordVisibility } from '../../../@core/mixins/ui/forms'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    BFormGroup,
    BFormInput,
    BInputGroupAppend,
    BInputGroup,
  },
  mixins: [togglePasswordVisibility],
  props: {
    vid: {
      type: String,
      default: '',
    },
    rules: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  setup() {},
  computed: {
    passwordToggleIcon() {
      return (this as any).passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    },
  },
})
</script>
