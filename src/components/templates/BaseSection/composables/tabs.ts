import type { Ref } from 'vue'
import { nextTick } from 'vue'
import { FormTabs } from '../../../../@model/enums/formTabs'

const existFieldName = (fieldName: string, form: unknown): boolean => {
  if (!form || typeof form !== 'object')
    return false

  return Object.entries(form).some(([key, value]) => {
    if (fieldName.includes(key))
      return true

    // На случай если нужный ключ находится внутри объекта
    if (typeof value === 'object' && value !== null)
      return Object.keys(value).some(innerKey => fieldName.includes(innerKey))

    return false
  })
}

export const setTabError = (fieldName: string, form: Ref<Record<string, unknown>>) => {
  const fieldElement: HTMLElement | null = document.getElementById(`${fieldName}-field`)
  let tabName = ''

  if (fieldElement) {
    const windowElement: HTMLElement | null = fieldElement.closest('div[data-tab]')

    if (windowElement)
      tabName = windowElement.dataset.tab!
    else if (existFieldName(fieldName, form.value))
      tabName = FormTabs.Main
    else if (existFieldName(fieldName, form.value.seo))
      tabName = FormTabs.Seo
    else if (existFieldName(fieldName, form.value.fieldTranslations))
      tabName = FormTabs.Localization
    else return

    const tabButton: HTMLElement | null = document.querySelector(
      `button[value=${tabName}]`,
    )

    tabButton && tabButton.click()

    nextTick(() => {
      fieldElement.scrollIntoView({
        block: 'start',
      })
    })
  }
}
