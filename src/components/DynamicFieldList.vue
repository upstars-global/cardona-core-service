<template>
  <div>
    <b-row v-if="templateField">
      <b-col v-if="isBaseField(templateField)">
        <label>{{ templateField?.label }}</label>
      </b-col>

      <b-col v-for="(item, index) in Object.values(templateField)" v-else :key="index">
        <label v-if="!(index > 0 && !rows.length)">{{ item?.label }}</label>
      </b-col>

      <b-col md="1"></b-col>
    </b-row>

    <b-row v-for="(row, index) in rows" :key="index" class="mb-1">
      <b-col v-if="isBaseField(row)">
        <field-generator
          v-model="rows[index]"
          :options="filteredOptions"
          :with-label="false"
          :with-info="false"
          :disabled="disabled"
          @search="fetchSelectOptions"
        />
      </b-col>

      <b-col v-for="(fieldInfo, key, idx) in row" v-else :key="idx">
        <field-generator
          v-model="rows[index][key]"
          :options="filteredOptions"
          :with-label="false"
          :with-info="false"
          :disabled="disabled"
          @search="fetchSelectOptions"
        />
      </b-col>

      <b-col md="1" class="d-flex align-items-center">
        <feather-icon
          v-if="index || !required"
          :icon="IconsList.Trash2Icon"
          class="text-danger cursor-pointer"
          :class="{ 'cursor-default': disabled }"
          @click="onRemove(index)"
        />
      </b-col>
    </b-row>

    <b-button
      size="sm"
      variant="outline-secondary"
      :disabled="disabled || isDisabled || isSelectItemNotEmpty"
      @click="onAdd"
    >
      <feather-icon :icon="IconsList.PlusIcon" />

      <span class="text-nowrap">
        {{ $t('action.add') }}
      </span>
    </b-button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { debounce } from 'lodash'
import FieldGenerator from '../components/templates/FieldGenerator/index.vue'
import { FieldInfo } from '../@model/field'
import { IconsList } from '../@model/enums/icons'
import { BaseField, getInstanceClass, SelectBaseField } from '../@model/baseField'

type DynamicField = FieldInfo | BaseField | Record<string, FieldInfo | BaseField>

export default defineComponent({
  name: 'DynamicFieldList',
  components: {
    FieldGenerator,
  },

  props: {
    value: {
      type: Array as PropType<DynamicField[]>,
      default: () => [],
    },

    templateField: {
      type: Object,
      require: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    required: {
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

    const isSelectItemNotEmpty = computed(() => {
      if (
        props.value?.[0] &&
        Object.values(props.value[0])?.[0] &&
        isBaseField(Object.values(props.value[0])?.[0])
      ) {
        return isSelect(Object.values(props.value[0])[0]) && !filteredOptions.value.length
      }
      return false
    })

    const isDisabled = computed(() => {
      return props.value?.some((row: DynamicField): boolean => {
        if (isBaseField(row)) {
          return !row.value
        } else {
          return !Object.values(row)?.[0].value
        }
      })
    })

    const isBaseField = (field: object): boolean =>
      field instanceof FieldInfo || field instanceof BaseField
    const isSelect = (field: object): boolean =>
      field instanceof SelectBaseField || field?.type?.includes('select')

    // Options
    const filteredOptions = computed<Array<any>>(() => {
      const selectedIds: Array<string> = rows.value
        .map((row: DynamicField) => {
          if (isSelect(row)) {
            return row.value.id
          } else {
            const selectField = Object.values(row).find((field: FieldInfo | BaseField) =>
              isSelect(field)
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

    const fetchStartSelect = async (rows) => {
      const [row]: Array<FieldInfo | BaseField> = rows

      if (row) {
        const selectFieldItem = Object.values(row).find((field) => field?.fetchOptionsActionName)

        if (selectFieldItem) {
          selectField.value = selectFieldItem

          await selectField.value.fetchOptions()
        }
      }
    }
    onMounted(async () => {
      await fetchStartSelect([props.templateField])
    })

    const fetchSelectOptions = debounce(async (search = '') => {
      await selectField.value.fetchOptions(search)
    }, 250)

    // Handlers
    const onAdd = async () => {
      let [itemTemplate]: any = [props.templateField]
      const fieldClass = getInstanceClass(rows.value[0])

      if (rows.value[0] instanceof FieldInfo) {
        itemTemplate = new FieldInfo({
          ...itemTemplate,
          value: undefined,
        })
      } else if (fieldClass) {
        itemTemplate = new fieldClass({
          ...itemTemplate,
          value: undefined,
        })
      } else {
        for (let key in itemTemplate) {
          const templateData = {
            ...itemTemplate[key],
            value: undefined,
          }

          if (itemTemplate[key] instanceof FieldInfo) {
            itemTemplate[key] = new FieldInfo(templateData)
          } else {
            const fieldClass = getInstanceClass(itemTemplate[key])

            itemTemplate[key] = fieldClass && new fieldClass(templateData)
          }
        }
      }

      rows.value.push(itemTemplate)
    }

    const onRemove = (index: number) => !props.disabled && rows.value.splice(index, 1)

    return {
      isBaseField,
      FieldInfo,
      rows,
      filteredOptions,
      fetchSelectOptions,
      onAdd,
      onRemove,
      isDisabled,
      isSelectItemNotEmpty,
      IconsList,
    }
  },
})
</script>