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

  const getCursorPosition = () => {
    if (!editorEntity.value)
      return null

    const editor = editorEntity.value
    const selection = editor.selection.get()

    if (!selection)
      return null

    const range = selection.getRangeAt(0)
    const preCaretRange = range.cloneRange()

    preCaretRange.selectNodeContents(editor.el)
    preCaretRange.setEnd(range.startContainer, range.startOffset)

    const tempDiv = document.createElement('div')

    tempDiv.appendChild(preCaretRange.cloneContents())

    return tempDiv.innerHTML.length // Возвращает индекс курсора в HTML
  }

  const setCursorPosition = (position: number) => {
    if (!editorEntity.value)
      return

    const editor = editorEntity.value
    const selection = window.getSelection()
    const range = document.createRange()

    let currentOffset = 0

    function findTextNode(node) {
      if (node.nodeType === 3) {
        const nextOffset = currentOffset + node.textContent.length

        if (position >= currentOffset && position <= nextOffset) {
          range.setStart(node, position - currentOffset)
          range.setEnd(node, position - currentOffset)

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

    // 🔥 Вставляем каретку в нужное место после загрузки контента
    nextTick(() => {
      if (findTextNode(editor.el)) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    })
  }

  return {
    setCursorPosition,
    saveCaretPosition,
    observeDOMChanges,
    restoreCaretPosition,
    getCursorPosition,
  }
}
