<script lang="ts" setup>
defineEmits<{
  (e: 'close'): void
}>()

const content = ref('')

const to = ref('')
const subject = ref('')
const message = ref('')
const isMenuOpen = ref(false)

const resetValues = () => {
  to.value = subject.value = message.value = ''
}
</script>

<template>
  <VCard
    class="email-compose-dialog"
    elevation="24"
    max-width="30vw"
  >
    <VCardItem class="py-3 px-5">
      <div class="d-flex align-center">
        <span class="font-weight-medium">Compose Mail</span>
        <VSpacer />
        <VIcon
          size="20"
          icon="tabler-minus"
          class="me-4"
          @click="$emit('close')"
        />
        <VIcon
          size="20"
          icon="tabler-x"
          @click="$emit('close'); resetValues()"
        />
      </div>
    </VCardItem>

    <div class="pe-5">
      <VTextField
        v-model="to"
        density="compact"
      >
        <template #prepend-inner>
          <div class="text-sm text-disabled">
            To:
          </div>
        </template>
        <template #append>
          <span class="cursor-pointer text-primary">Cc | Bcc</span>
        </template>
      </VTextField>
    </div>

    <VDivider />

    <VTextField
      v-model="subject"
      density="compact"
    >
      <template #prepend-inner>
        <div class="text-sm text-disabled">
          Subject:
        </div>
      </template>
    </VTextField>

    <VDivider />

    <!-- 👉 Tiptap Editor  -->
    <TiptapEditor v-model="content" />

    <VDivider />

    <div class="d-flex align-center px-5 py-4">
      <VBtnGroup
        color="primary"
        divided
        density="comfortable"
      >
        <VBtn>Send</VBtn>
        <VBtn
          icon
          @click="() => isMenuOpen = !isMenuOpen"
        >
          <VIcon
            icon="tabler-send "
            size="18"
          />
          <VMenu activator="parent">
            <VList :items="['Schedule Mail', 'Save Draft']" />
          </VMenu>
        </VBtn>
      </VBtnGroup>
      <VIcon
        icon="tabler-link"
        class="ms-4 cursor-pointer"
      />

      <VSpacer />
      <VBtn
        icon
        variant="text"
        color="default"
        density="comfortable"
      >
        <VIcon
          icon="tabler-dots-vertical"
          size="20"
        />
      </VBtn>

      <VBtn
        icon
        variant="text"
        color="default"
        density="comfortable"
        @click="$emit('close'); resetValues()"
      >
        <VIcon
          icon="tabler-trash"
          size="20"
        />
      </VBtn>
    </div>
  </VCard>
</template>

<style lang="scss">
@use "@core/scss/base/mixins";

.v-card.email-compose-dialog {
  z-index: 910 !important;

  @include mixins.elevation(18);

  .v-field--prepended {
    padding-inline-start: 20px;
  }

  .v-field__prepend-inner {
    align-items: center;
    padding: 0;
  }

  .v-card-item {
    background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
  }

  .v-textarea .v-field {
    --v-field-padding-start: 20px;
  }

  .v-field__outline {
    display: none;
  }

  .v-input {
    .v-field__prepend-inner {
      display: flex;
      align-items: center;
      padding-block-start: 0;
    }
  }

  .app-text-field {
    .v-field__input {
      padding-block-start: 6px;
    }

    .v-field--focused {
      box-shadow: none !important;
    }
  }
}

.ProseMirror{
  p{
    margin-block-end: 0;
  }

  padding: 0.5rem;

  p.is-editor-empty:first-child::before {
    block-size: 0;
    color: #adb5bd;
    content: attr(data-placeholder);
    float: inline-start;
    pointer-events: none;
  }

  &-focused{
    outline: none
  }
}
</style>
