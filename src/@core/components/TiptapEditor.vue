<script setup lang="ts">
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import { StarterKit } from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'

const props = defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref()

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Placeholder.configure({
      placeholder: props.placeholder ?? 'Write something here...',
    }),
    Underline,
  ],
  onUpdate() {
    if (!editor.value)
      return

    emit('update:modelValue', editor.value.getHTML())
  },
})

watch(() => props.modelValue, () => {
  const isSame = editor.value?.getHTML() === props.modelValue

  if (isSame)
    return

  editor.value?.commands.setContent(props.modelValue)
})
</script>

<template>
  <div>
    <div
      v-if="editor"
      class="d-flex gap-3 pa-2 flex-wrap align-center"
    >
      <VIcon
        class="font-weight-medium"
        icon="tabler-bold"
        :color="editor.isActive('bold') ? 'primary' : 'default'"
        size="20"
        @click="editor.chain().focus().toggleBold().run()"
      />

      <VIcon
        :color="editor.isActive('underline') ? 'primary' : 'default'"
        icon="tabler-underline"
        size="20"
        @click="editor.commands.toggleUnderline()"
      />

      <VIcon
        :color="editor.isActive('italic') ? 'primary' : 'default'"
        icon="tabler-italic"
        size="20"
        @click="editor.chain().focus().toggleItalic().run()"
      />

      <VIcon
        icon="tabler-strikethrough"
        size="20"
        :color="editor.isActive('strike') ? 'primary' : 'default'"
        @click="editor.chain().focus().toggleStrike().run()"
      />

      <VIcon
        :color="editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'"
        icon="tabler-align-left"
        size="20"
        @click="editor.chain().focus().setTextAlign('left').run()"
      />

      <VIcon
        icon="tabler-align-center"
        size="20"
        :color="editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'"
        @click="editor.chain().focus().setTextAlign('center').run()"
      />

      <VIcon
        :color="editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'"
        icon="tabler-align-right"
        size="20"
        @click="editor.chain().focus().setTextAlign('right').run()"
      />

      <VIcon
        :color="editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'"
        icon="tabler-align-justified"
        size="20"
        @click="editor.chain().focus().setTextAlign('justify').run()"
      />
    </div>

    <VDivider />

    <EditorContent
      ref="editorRef"
      :editor="editor"
    />
  </div>
</template>

<style lang="scss">
.ProseMirror {
  padding: 0.5rem;
  min-block-size: 15vh;

  p {
    margin-block-end: 0;
  }

  p.is-editor-empty:first-child::before {
    block-size: 0;
    color: #adb5bd;
    content: attr(data-placeholder);
    float: inline-start;
    pointer-events: none;
  }
}
</style>
