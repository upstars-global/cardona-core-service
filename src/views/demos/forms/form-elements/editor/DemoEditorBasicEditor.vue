<script setup lang="ts">
const basicEditorContent = ref(`
<p>
  This is a radically reduced version of tiptap. It has support for a document, with paragraphs and text. That's it. It's probably too much for real minimalists though.
</p>
<p>
  The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.  
</p>
`)
</script>

<template>
  <div>
    <TiptapEditor
      v-model="basicEditorContent"
      class="border rounded"
    />
  </div>
</template>

<style lang="scss">
.ProseMirror {
  block-size: 200px;
  outline: none;
  overflow-y: auto;
  padding-inline: 0.5rem;
}
</style>
