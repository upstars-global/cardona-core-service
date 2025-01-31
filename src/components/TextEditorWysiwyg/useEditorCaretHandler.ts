import { nextTick } from 'vue'

export function useEditorCaretHandler(editor: Ref<any>) {
  const editorEntity = editor

  const saveCaretPosition = () => {
    const selection = window.getSelection()
    if (!selection.rangeCount)
      return null

    const range = selection.getRangeAt(0)
    const preCaretRange = range.cloneRange()

    preCaretRange.selectNodeContents(editorEntity.value.el)
    preCaretRange.setEnd(range.startContainer, range.startOffset)

    return {
      offset: preCaretRange.toString().length,
      container: range.startContainer,
    }
  }

  const observeDOMChanges = callback => {
    const observer = new MutationObserver(() => {
      observer.disconnect()
      setTimeout(callback, 0)
    })

    observer.observe(editorEntity.value.el, { childList: true, subtree: true })
  }

  const restoreCaretPosition = caretInfo => {
    if (!caretInfo || !editorEntity.value)
      return

    const selection = window.getSelection()
    const range = document.createRange()

    let currentOffset = 0

    function findTextNode(node) {
      if (node.nodeType === 3) {
        const nextOffset = currentOffset + node.textContent.length
        if (caretInfo.offset >= currentOffset && caretInfo.offset <= nextOffset) {
          range.setStart(node, caretInfo.offset - currentOffset)
          range.setEnd(node, caretInfo.offset - currentOffset)

          return true
        }
        currentOffset = nextOffset
      }
      else {
        for (const child of node.childNodes) {
          if (findTextNode(child))
            return true
        }
      }

      return false
    }

    // Восстанавливаем каретку после обновления DOM
    nextTick(() => {
      if (findTextNode(editorEntity.value.el)) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    })
  }

  return {
    saveCaretPosition,
    observeDOMChanges,
    restoreCaretPosition,
  }
}
