<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import ComposeDialog from '@/views/apps/email/ComposeDialog.vue'
import EmailLeftSidebarContent from '@/views/apps/email/EmailLeftSidebarContent.vue'
import EmailView from '@/views/apps/email/EmailView.vue'
import type { MoveEmailToAction } from '@/views/apps/email/useEmail'
import { useEmail } from '@/views/apps/email/useEmail'
import type { Email } from '@db/apps/email/types'

definePage({
  meta: {
    layoutWrapperClasses: 'layout-content-height-fixed',
  },
})

const { isLeftSidebarOpen } = useResponsiveLeftSidebar()

// Composables
const route = useRoute<'apps-email-filter' | 'apps-email-label'>()

const {
  labels,
  resolveLabelColor,
  emailMoveToFolderActions,
  shallShowMoveToActionFor,
  moveSelectedEmailTo,
  updateEmails,
  updateEmailLabels,
} = useEmail()

// Compose dialog
const isComposeDialogVisible = ref(false)

// Ref
const q = ref('')

// ------------------------------------------------
// Email Selection
// ------------------------------------------------
const selectedEmails = ref<Email['id'][]>([])

// Fetch Emails
const { data: emailData, execute: fetchEmails } = await useApi<any>(createUrl('/apps/email', {
  query: {
    q,
    filter: () => 'filter' in route.params ? route.params.filter : undefined,
    label: () => 'label' in route.params ? route.params.label : undefined,
  },
}))

const emails = computed<Email[]>(() => emailData.value.emails)

const toggleSelectedEmail = (emailId: Email['id']) => {
  const emailIndex = selectedEmails.value.indexOf(emailId)
  if (emailIndex === -1)
    selectedEmails.value.push(emailId)
  else selectedEmails.value.splice(emailIndex, 1)
}

const selectAllEmailCheckbox = computed(
  () => emails.value.length && emails.value.length === selectedEmails.value.length,
)

const isSelectAllEmailCheckboxIndeterminate = computed(
  () =>
    Boolean(selectedEmails.value.length)
    && emails.value.length !== selectedEmails.value.length,
)

const isAllMarkRead = computed (() => {
  return selectedEmails.value.every(emailId => emails.value.find(email => email.id === emailId)?.isRead)
})

const selectAllCheckboxUpdate = () => {
  selectedEmails.value = !selectAllEmailCheckbox.value
    ? emails.value.map(email => email.id)
    : []
}

// Email View
const openedEmail = ref<Email | null>(null)

const emailViewMeta = computed(() => {
  const returnValue = {
    hasNextEmail: false,
    hasPreviousEmail: false,
  }

  if (openedEmail.value) {
    const openedEmailIndex = emails.value.findIndex(
      e => e.id === openedEmail.value?.id,
    )

    returnValue.hasNextEmail = !!emails.value[openedEmailIndex + 1]
    returnValue.hasPreviousEmail = !!emails.value[openedEmailIndex - 1]
  }

  return returnValue
})

/*
  ℹ️ You can optimize it so it doesn't fetch emails on each action.
    Currently, if you just star the email, two API calls will get fired.
      1. star the email
      2. Fetch all latest emails

    You can limit this to single API call by:
      - making API to star the email
      - modify the state (set that email's isStarred property to true/false) in the store instead of making API for fetching emails

  😊 For simplicity of the code and possible of modification, we kept it simple.
*/

const handleActionClick = async (
  action: 'trash' | 'unread' | 'read' | 'spam' | 'star' | 'unstar',
  emailIds: Email['id'][] = selectedEmails.value,
) => {
  selectedEmails.value = []
  selectedEmails.value = []
  if (!emailIds.length)
    return

  if (action === 'trash')
    await updateEmails(emailIds, { isDeleted: true })
  else if (action === 'spam')
    await updateEmails(emailIds, { folder: 'spam' })
  else if (action === 'unread')
    await updateEmails(emailIds, { isRead: false })
  else if (action === 'read')
    await updateEmails(emailIds, { isRead: true })
  else if (action === 'star')
    await updateEmails(emailIds, { isStarred: true })
  else if (action === 'unstar')
    await updateEmails(emailIds, { isStarred: false })

  await fetchEmails()
}

// Email actions
const handleMoveMailsTo = (action: MoveEmailToAction) => {
  moveSelectedEmailTo(action, selectedEmails.value)
  fetchEmails()
}

// Email view
const changeOpenedEmail = (dir: 'previous' | 'next') => {
  if (!openedEmail.value)
    return

  const openedEmailIndex = emails.value.findIndex(
    e => e.id === openedEmail.value?.id,
  )

  const newEmailIndex = dir === 'previous' ? openedEmailIndex - 1 : openedEmailIndex + 1

  openedEmail.value = emails.value[newEmailIndex]
}

const openEmail = (email: Email) => {
  openedEmail.value = email

  handleActionClick('read', [email.id])
}

const refreshOpenedEmail = async () => {
  await fetchEmails()

  if (openedEmail.value)
    openedEmail.value = emails.value.find(e => e.id === openedEmail.value?.id)!
}

// Reset selected emails when filter or label is updated
watch(
  () => route.params,
  () => { selectedEmails.value = [] },
  { deep: true },
)
</script>

<template>
  <VLayout
    style="min-block-size: 100%;"
    class="email-app-layout"
  >
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      absolute
      touchless
      location="start"
      :temporary="$vuetify.display.mdAndDown"
    >
      <EmailLeftSidebarContent @toggle-compose-dialog-visibility="isComposeDialogVisible = !isComposeDialogVisible" />
    </VNavigationDrawer>
    <EmailView
      :email="openedEmail"
      :email-meta="emailViewMeta"
      @refresh="refreshOpenedEmail"
      @navigated="changeOpenedEmail"
      @close="openedEmail = null"
      @remove="handleActionClick('trash', openedEmail ? [openedEmail.id] : [])"
      @unread="handleActionClick('unread', openedEmail ? [openedEmail.id] : [])"
      @star="handleActionClick('star', openedEmail ? [openedEmail.id] : [])"
      @unstar="handleActionClick('unstar', openedEmail ? [openedEmail.id] : [])"
    />
    <VMain>
      <VCard
        flat
        class="email-content-list h-100 d-flex flex-column"
      >
        <div class="d-flex align-center">
          <IconBtn
            class="d-lg-none ms-3"
            @click="isLeftSidebarOpen = true"
          >
            <VIcon icon="tabler-menu-2" />
          </IconBtn>

          <!-- 👉 Search -->
          <VTextField
            v-model="q"
            density="default"
            class="email-search px-1 flex-grow-1"
            prepend-inner-icon="tabler-search"
            placeholder="Search email"
          />
        </div>
        <VDivider />
        <!-- 👉 Action bar -->
        <div class="py-2 px-5 d-flex align-center">
          <!-- TODO: Make checkbox primary on indeterminate state -->
          <VCheckbox
            :model-value="selectAllEmailCheckbox"
            :indeterminate="isSelectAllEmailCheckboxIndeterminate"
            @update:model-value="selectAllCheckboxUpdate"
          />
          <div
            class="w-100 d-flex align-center action-bar-actions"
            :style="{
              visibility:
                isSelectAllEmailCheckboxIndeterminate || selectAllEmailCheckbox
                  ? undefined
                  : 'hidden',
            }"
          >
            <!-- Trash -->
            <IconBtn
              v-show="('filter' in route.params ? route.params.filter !== 'trashed' : true)"
              @click="handleActionClick('trash')"
            >
              <VIcon icon="tabler-trash" />
              <VTooltip
                activator="parent"
                location="top"
              >
                Delete Mail
              </VTooltip>
            </IconBtn>
            <!-- Mark unread/read -->
            <IconBtn @click="isAllMarkRead ? handleActionClick('unread') : handleActionClick('read') ">
              <VIcon :icon="isAllMarkRead ? 'tabler-mail' : 'tabler-mail-opened'" />
              <VTooltip
                activator="parent"
                location="top"
              >
                {{ isAllMarkRead ? 'Mark as Unread' : 'Mark as Read' }}
              </VTooltip>
            </IconBtn>
            <!-- Move to folder -->
            <IconBtn>
              <VIcon icon="tabler-folder" />
              <VTooltip
                activator="parent"
                location="top"
              >
                Folder
              </VTooltip>
              <VMenu activator="parent">
                <VList density="compact">
                  <template
                    v-for="moveTo in emailMoveToFolderActions"
                    :key="moveTo.title"
                  >
                    <VListItem
                      :class="shallShowMoveToActionFor(moveTo.action) ? 'd-flex' : 'd-none'"
                      href="#"
                      class="items-center"
                      @click="handleMoveMailsTo(moveTo.action)"
                    >
                      <template #prepend>
                        <VIcon
                          :icon="moveTo.icon"
                          class="me-2"
                          size="20"
                        />
                      </template>
                      <VListItemTitle class="text-capitalize">
                        {{ moveTo.action }}
                      </VListItemTitle>
                    </VListItem>
                  </template>
                </VList>
              </VMenu>
            </IconBtn>
            <!-- Update labels -->
            <IconBtn>
              <VIcon icon="tabler-tag" />
              <VTooltip
                activator="parent"
                location="top"
              >
                Label
              </VTooltip>
              <VMenu activator="parent">
                <VList density="compact">
                  <VListItem
                    v-for="label in labels"
                    :key="label.title"
                    href="#"
                    @click="updateEmailLabels(selectedEmails, label.title)"
                  >
                    <template #prepend>
                      <VBadge
                        inline
                        :color="resolveLabelColor(label.title)"
                        dot
                      />
                    </template>
                    <VListItemTitle class="ms-2 text-capitalize">
                      {{ label.title }}
                    </VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </IconBtn>
          </div>
          <VSpacer />
          <IconBtn @click="fetchEmails">
            <VIcon icon="tabler-reload" />
          </IconBtn>
          <MoreBtn
            density="comfortable"
            color="undefined"
          />
        </div>
        <VDivider />
        <!-- 👉 Emails list -->
        <PerfectScrollbar
          tag="ul"
          :options="{ wheelPropagation: false }"
          class="email-list"
        >
          <li
            v-for="email in emails"
            v-show="emails?.length"
            :key="email.id"
            class="email-item d-flex align-center py-2 px-5 cursor-pointer"
            :class="[{ 'email-read': email.isRead }]"
            @click="openEmail(email)"
          >
            <VCheckbox
              :model-value="selectedEmails.includes(email.id)"
              class="flex-shrink-0"
              @update:model-value="toggleSelectedEmail(email.id)"
              @click.stop
            />
            <IconBtn
              :color="email.isStarred ? 'warning' : 'default'"
              @click.stop=" handleActionClick(email.isStarred ? 'unstar' : 'star', [email.id])"
            >
              <VIcon
                :icon="email.isStarred ? 'tabler-star-filled' : 'tabler-star'"
                :class="email.isStarred ? '' : 'text-disabled'"
              />
            </IconBtn>
            <VAvatar
              class="mx-2"
              size="32"
            >
              <VImg
                :src="email.from.avatar"
                :alt="email.from.name"
              />
            </VAvatar>
            <h6 class="mx-3 text-body-1 font-weight-medium text-high-emphasis">
              {{ email.from.name }}
            </h6>
            <span class="truncate">{{ email.subject }}</span>
            <VSpacer />
            <div
              class="email-meta"
              :class="$vuetify.display.xs ? 'd-none' : ''"
            >
              <VBadge
                v-for="label in email.labels"
                :key="label"
                inline
                :color="resolveLabelColor(label)"
                dot
              />
              <small class="text-disabled text-sm ms-2">{{
                formatDateToMonthShort(email.time)
              }}</small>
            </div>
            <!-- 👉 Email actions -->
            <div class="email-actions d-none">
              <IconBtn @click.stop="handleActionClick('trash', [email.id])">
                <VIcon icon="tabler-trash" />
                <VTooltip
                  activator="parent"
                  location="top"
                >
                  Delete Mail
                </VTooltip>
              </IconBtn>
              <IconBtn @click.stop=" handleActionClick(email.isRead ? 'unread' : 'read', [email.id])">
                <VIcon :icon="email.isRead ? 'tabler-mail' : 'tabler-mail-opened'" />
                <VTooltip
                  activator="parent"
                  location="top"
                >
                  {{ email.isRead ? 'Mark as Unread' : 'Mark as Read' }}
                </VTooltip>
              </IconBtn>
              <IconBtn @click.stop="handleActionClick('spam', [email.id])">
                <VIcon icon="tabler-alert-octagon" />
                <VTooltip
                  activator="parent"
                  location="top"
                >
                  Move to Spam
                </VTooltip>
              </IconBtn>
            </div>
          </li>
          <li
            v-show="!emails.length"
            class="py-4 px-5 text-center"
          >
            <span class="text-high-emphasis">No items found.</span>
          </li>
        </PerfectScrollbar>
      </VCard>
      <ComposeDialog
        v-show="isComposeDialogVisible"
        @close="isComposeDialogVisible = false"
      />
    </VMain>
  </VLayout>
</template>

<style lang="scss">
@use "@styles/variables/_vuetify.scss";
@use "@core/scss/base/_mixins.scss";

// ℹ️ Remove border. Using variant plain cause UI issue, caret isn't align in center
.email-search {
  .v-field__outline {
    display: none;
  }
}

.email-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-email-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-email-app-layout);
    }
  }
}

.email-content-list {
  border-end-start-radius: 0;
  border-start-start-radius: 0;
}

.email-list {
  white-space: nowrap;

  .email-item {
    block-size: 3.75rem;
    transition: all 0.2s ease-in-out;
    will-change: transform, box-shadow;

    &.email-read {
      background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
    }

    & + .email-item {
      border-block-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    }
  }

  .email-item:hover {
    transform: translateY(-2px);

    @include mixins.elevation(3);

    .email-actions {
      display: block !important;
    }

    .email-meta {
      display: none;
    }

    + .email-item {
      border-color: transparent;
    }

    @media screen and (max-width: 600px) {
      .email-actions {
        display: none !important;
      }
    }
  }
}

.email-compose-dialog {
  position: absolute;
  inset-block-end: 0;
  inset-inline-end: 0;
  min-inline-size: 100%;

  @media only screen and (min-width: 800px) {
    min-inline-size: 712px;
  }
}
</style>
