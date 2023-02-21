<template>
  <b-card no-body>
    <b-card-header>
      <b-card-title>
        {{ $t('title.seo') }}
      </b-card-title>
    </b-card-header>

    <b-card-body>
      <b-row class="mb-2">
        <b-col md="4">
          <field-generator
            v-model="form.metaTitle"
            :disabled="disabled"
            data-at="metaTitle"
            @input="onInput"
          />
        </b-col>

        <b-col md="4">
          <field-generator
            v-model="form.fakeMetaTitle"
            :disabled="disabled"
            data-at="fakeMetaTitle"
            @input="onInput"
          />
        </b-col>
      </b-row>

      <b-row class="mb-2">
        <b-col md="4">
          <field-generator
            v-model="form.metaDescription"
            :disabled="disabled"
            data-at="metaDescription"
            @input="onInput"
          />
        </b-col>

        <b-col md="4">
          <field-generator
            v-model="form.fakeMetaDescription"
            :disabled="disabled"
            data-at="fakeMetaDescription"
            @input="onInput"
          />
        </b-col>
      </b-row>

      <b-row class="mb-2">
        <b-col>
          <field-generator
            v-model="form.description"
            :disabled="disabled"
            data-at="description"
            @input="onInput"
          />
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <field-generator
            v-model="form.fakeDescription"
            :disabled="disabled"
            data-at="fakeDescription"
            @input="onInput"
          />
        </b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { transformFormData } from '@/helpers'
import { SeoForm } from '@model/seo'
import FieldGenerator from '@/components/templates/FieldGenerator'

export default defineComponent({
  name: 'SeoForm',
  components: {
    FieldGenerator,
  },

  props: {
    value: {
      type: Object,
      default: () => ({}),
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const form = ref<SeoForm | null>(null)

    watch(
      () => props.value,
      () => {
        form.value = new SeoForm(props.value['seo'])
        if (form.value.description && form.value.fakeDescription) {
          form.value.description.form = props.value
          form.value.fakeDescription.form = props.value
        }
      },
      { immediate: true, deep: true }
    )

    const onInput = (val) => {
      if (val?.form?.localisationParameters) {
        props!.value.localisationParameters = val.form.localisationParameters
      }
      props!.value.seo = transformFormData(form.value)
    }

    return {
      form,
      onInput,
    }
  },
})
</script>
