<template>
  <div>
    <b-row v-for="(row, index) in rows" :key="index" class="mb-1">
      <b-col v-if="row instanceof FieldInfo">
        <field-generator
          v-model="rows[index]"
          :options="filteredOptions"
          :with-label="!index"
          :with-info="!index"
          :disabled="disabled"
          @search="fetchSelectOptions"
        />
      </b-col>

      <b-col v-for="(fieldInfo, key, idx) in row" v-else :key="idx">
        <field-generator
          v-model="rows[index][key]"
          :options="filteredOptions"
          :with-label="!index"
          :with-info="!index"
          :disabled="disabled"
          @search="fetchSelectOptions"
        />
      </b-col>

      <b-col md="1" class="d-flex align-items-center">
        <feather-icon
          v-if="index"
          icon="Trash2Icon"
          class="text-danger cursor-pointer"
          :class="{ 'cursor-default': disabled }"
          @click="onRemove(index)"
        />
      </b-col>
    </b-row>

    <b-button size="sm" variant="outline-secondary" :disabled="disabled" @click="onAdd">
      <feather-icon icon="PlusIcon" />

      <span class="text-nowrap">
        {{ $t('action.add') }}
      </span>
    </b-button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { debounce } from 'lodash'
import FieldGenerator from '@/components/templates/FieldGenerator/index.vue'
import { FieldInfo } from '@model/field'

export default defineComponent({
  name: 'DynamicFieldList',
  components: {
    FieldGenerator,
  },

  props: {
    value: {
      type: Array,
      default: () => [],
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const rows = ref()

    watch(
      () => props.value,
      () => (rows.value = props.value),
      { deep: true, immediate: true }
    )

    // Options
    const filteredOptions = computed(() => {
      const selectedIds: Array<string> = rows.value
        .map((row: object) => {
          if (row instanceof FieldInfo) {
            return row.type.includes('select') && row.value?.id
          } else {
            const selectField: FieldInfo | undefined = Object.values(row).find((field: FieldInfo) =>
              field.type.includes('select')
            )

            return selectField?.value?.id
          }
        })
        .filter((item) => !!item)

      return selectField.value && selectField.value.options
        ? selectField.value.options.filter((option: any) => !selectedIds.includes(option?.id))
        : []
    })

    // Search
    const selectField: any = ref()

    onMounted(async () => {
      const [row]: Array<FieldInfo> = rows.value

      if (row) {
        const selectFieldItem: FieldInfo | undefined = Object.values(row).find(
          (field: FieldInfo) => field?.fetchOptionsActionName
        )

        if (selectFieldItem) {
          selectField.value = selectFieldItem

          await selectField.value.fetchOptions()
        }
      }
    })

    const fetchSelectOptions = debounce(async (search: string = '') => {
      await selectField.value.fetchOptions(search)
    }, 250)

    // Handlers
    const onAdd = () => {
      let [itemTemplate] = JSON.parse(JSON.stringify(rows.value))

      if (rows.value[0] instanceof FieldInfo) {
        itemTemplate = new FieldInfo({
          ...itemTemplate,
          value: undefined,
        })
      } else {
        for (let key in itemTemplate) {
          itemTemplate[key] = new FieldInfo({
            ...itemTemplate[key],
            value: undefined,
          })
        }
      }

      rows.value.push(itemTemplate)
    }

    const onRemove = (index: number) => !props.disabled && rows.value.splice(index, 1)

    return {
      FieldInfo,
      rows,
      filteredOptions,
      fetchSelectOptions,
      onAdd,
      onRemove,
    }
  },
})
</script>
