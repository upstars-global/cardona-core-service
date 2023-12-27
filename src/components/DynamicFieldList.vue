<template>
  <div>
    <b-row v-if="templateField && !hideLabelOnEmptyList">
      <b-col v-if="isBaseField(templateField)">
        <label>{{ templateField?.label }}</label>
      </b-col>

      <b-col v-for="(item, index) in Object.values(templateField)" v-else :key="index">
        <template v-if="!rows.length">
          <label v-show="!index">{{ item?.label }}</label>
        </template>
      </b-col>

      <b-col md="1"></b-col>
    </b-row>

    <div v-for="(row, rowIndex) in rows" :key="rowIndex" class="filed-list__item">
      <b-row>
        <b-col v-if="isBaseField(row)">
          <field-generator
            v-model="rows[rowIndex]"
            :options="filteredOptions"
            :with-info="false"
            :disabled="disabled"
            @search="fetchSelectOptions"
          />
        </b-col>

        <b-col v-for="(fieldInfo, key, idx) in row" v-else :key="idx">
          <field-generator
            v-model="rows[rowIndex][key]"
            :options="filteredOptions"
            :disabled="disabled"
            :with-info="false"
            @search="fetchSelectOptions"
          />
        </b-col>

        <b-col md="1" class="d-flex justify-content-start pl-50 remove-field__wrapper">
          <feather-icon
            v-if="rowIndex || !required"
            :icon="IconsList.Trash2Icon"
            class="text-danger cursor-pointer"
            :class="{ 'cursor-default': disabled }"
            @click="onRemove(rowIndex)"
          />
        </b-col>
      </b-row>
    </div>

    <b-button
      size="sm"
      variant="outline-secondary"
      class="mt-50"
      :disabled="disableAddFiled"
      @click="onAdd"
    >
      <feather-icon :icon="IconsList.PlusIcon" />

      <span class="text-nowrap"> {{ $t('action.add') }} </span>
    </b-button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref, watch } from 'vue'
import { debounce } from 'lodash'
import FieldGenerator from '../components/templates/FieldGenerator/index.vue'
import { NumberOrString } from '../@model'
import { IconsList } from '../@model/enums/icons'
import { BaseField, getInstanceClass, SelectBaseField } from '../@model/baseField'

type DynamicField = BaseField | Record<string, BaseField>

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
    allowAddWithEmpty: {
      type: Boolean,
      default: false,
    },
    hideLabelOnEmptyList: {
      type: Boolean,
      default: true,
    },
  },
  emits: {
    'on-add-item': (itemData: { item: DynamicField; index: number }) => true,
  },
  setup(props, { emit }) {
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

    const isBaseField = (field: object): boolean => field instanceof BaseField
    const isSelect = (field: object): boolean => field instanceof SelectBaseField

    // Options
    const filteredOptions = computed<Array<any>>(() => {
      const selectedIds: Array<string> = rows.value
        .map((row: DynamicField) => {
          if (isSelect(row)) {
            return row.value.id
          } else {
            const selectField = Object.values(row).find((field: BaseField) => isSelect(field))

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
      const [row]: Array<BaseField> = rows

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

      if (fieldClass) {
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

          const fieldClass = getInstanceClass(itemTemplate[key])

          itemTemplate[key] = fieldClass && new fieldClass(templateData)
        }
      }

      rows.value.push(itemTemplate)
      emit('on-add-item', { item: itemTemplate, index: rows.value.length - 1 })
    }

    const onRemove = (index: NumberOrString) => !props.disabled && rows.value.splice(index, 1)

    const disableAddFiled = computed(() =>
      [
        props.disabled,
        !props.allowAddWithEmpty && isDisabled.value,
        isSelectItemNotEmpty.value,
      ].some(Boolean)
    )

    return {
      isBaseField,
      rows,
      filteredOptions,
      fetchSelectOptions,
      onAdd,
      onRemove,
      isDisabled,
      isSelectItemNotEmpty,
      IconsList,
      disableAddFiled,
    }
  },
})
</script>

<style lang="scss" scoped>
.filed-list__item {
  margin-bottom: 1.125rem;
}

.remove-field__wrapper {
  padding-top: 2.25rem;
}
</style>