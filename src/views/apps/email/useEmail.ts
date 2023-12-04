import type { PartialDeep } from 'type-fest'
import type { Email } from '@/plugins/fake-api/handlers/apps/email/types'

export type MoveEmailToAction = 'inbox' | 'spam' | 'trash'

export const useEmail = () => {
  const route = useRoute('apps-email-filter')

  const updateEmails = async (ids: Email['id'][], data: PartialDeep<Email>) => {
    await $api('apps/email', {
      method: 'POST',
      body: JSON.stringify({ ids, data }),
    })
  }

  const updateEmailLabels = async (ids: Email['id'][], label: Email['labels'][number]) => {
    await $api('/apps/email', {
      method: 'POST',
      body: { ids, label },
    })
  }

  const emailMoveToFolderActions: { action: MoveEmailToAction; icon: string }[] = [
    { action: 'inbox', icon: 'tabler-mail' },
    { action: 'spam', icon: 'tabler-alert-octagon' },
    { action: 'trash', icon: 'tabler-trash' },
  ]

  const labels: { title: Email['labels'][number]; color: string }[] = [
    {
      title: 'personal',
      color: 'success',

    },
    {
      title: 'company',
      color: 'primary',

    },
    {
      title: 'important',
      color: 'warning',

    },
    {
      title: 'private',
      color: 'error',

    },
  ]

  const resolveLabelColor = (label: Email['labels'][number]) => {
    if (label === 'personal')
      return 'success'
    if (label === 'company')
      return 'primary'
    if (label === 'important')
      return 'warning'
    if (label === 'private')
      return 'error'

    return 'secondary'
  }

  const shallShowMoveToActionFor = (action: MoveEmailToAction) => {
    if (action === 'trash')
      return route.params.filter !== 'trashed'

    else if (action === 'inbox')
      return !(route.params.filter === undefined || route.params.filter === 'sent' || route.params.filter === 'draft')

    else if (action === 'spam')
      return !(route.params.filter === 'spam' || route.params.filter === 'sent' || route.params.filter === 'draft')

    return false
  }

  const moveSelectedEmailTo = (action: MoveEmailToAction, selectedEmails: number[]) => {
    const dataToUpdate: PartialDeep<Email> = {}

    if (action === 'inbox') {
      if (route.params.filter === 'trashed')
        dataToUpdate.isDeleted = false
      dataToUpdate.folder = 'inbox'
    }

    else if (action === 'spam') {
      if (route.params.filter === 'trashed')
        dataToUpdate.isDeleted = false
      dataToUpdate.folder = 'spam'
    }

    else if (action === 'trash') {
      dataToUpdate.isDeleted = true
    }

    updateEmails(selectedEmails, dataToUpdate)
  }

  return {
    labels,
    resolveLabelColor,
    shallShowMoveToActionFor,
    emailMoveToFolderActions,
    moveSelectedEmailTo,
    updateEmails,
    updateEmailLabels,
  }
}
