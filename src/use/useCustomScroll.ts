import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const CUSTOM_SCROLL_CLASS = 'custom-scroll'
export function useCustomScroll() {
  onMounted(() => {
    document.querySelector('html').classList.add(CUSTOM_SCROLL_CLASS)
  })
}

// In-memory сховище позицій, живе поки живий модуль (переживає mount/unmount
// компонентів, але зникає при повному перезавантаженні сторінки)
const scrollPositionsStore = new Map()

/**
 * useScroll - composable для керування скролом елемента (або window)
 *
 * @param {object} options
 * @param {Ref|HTMLElement|Window|null} options.target - елемент для скролу (за замовч. window)
 * @param {string} options.storageKey - ключ для збереження позиції (in-memory)
 * @param {boolean} options.autoRestore - чи відновлювати позицію автоматично при mount
 * @param {boolean} options.autoSave - чи зберігати позицію автоматично при кожному scroll-івенті
 * @param {number} options.saveDebounce - дебаунс (мс) для автозбереження
 */
export function useScrollApp(options = {}) {
  const {
    target = null,
    storageKey = null,
    autoRestore = false,
    autoSave = false,
    saveDebounce = 200,
  } = options

  const scrollY = ref(0)
  const scrollX = ref(0)
  const isAtTop = ref(true)
  const isAtBottom = ref(false)

  let debounceTimer = null

  // --- Отримати реальний елемент, з яким працюємо ---
  function getElement() {
    if (!target)
      return window

    // якщо передали Vue ref
    if ('value' in target)
      return target.value || window

    return target
  }

  // --- Отримати поточну позицію скролу ---
  function getScrollPosition(el) {
    if (el === window) {
      return {
        x: window.scrollX || window.pageXOffset,
        y: window.scrollY || window.pageYOffset,
      }
    }

    return {
      x: el.scrollLeft,
      y: el.scrollTop,
    }
  }

  // --- Скролити елемент до конкретної позиції ---
  function scrollTo(y = 0, x = 0, behavior = 'auto') {
    const el = getElement()
    if (!el)
      return

    if (el === window)
      window.scrollTo({ top: y, left: x, behavior })
    else
      el.scrollTo({ top: y, left: x, behavior })
  }

  // --- Скролити в самий верх ---
  function scrollToTop(behavior = 'smooth') {
    scrollTo(0, 0, behavior)
  }

  // --- Скролити в самий низ ---
  function scrollToBottom(behavior = 'smooth') {
    const el = getElement()
    if (!el)
      return

    const maxScroll
      = el === window
        ? document.documentElement.scrollHeight - window.innerHeight
        : el.scrollHeight - el.clientHeight

    scrollTo(maxScroll, 0, behavior)
  }

  // --- Зберегти поточну позицію (у пам'яті + опційно sessionStorage) ---
  function savePosition() {
    const el = getElement()
    if (!el)
      return

    const pos = getScrollPosition(el)

    scrollX.value = pos.x
    scrollY.value = pos.y

    if (storageKey)
      scrollPositionsStore.set(storageKey, { x: pos.x, y: pos.y })
  }

  // --- Відновити позицію (з пам'яті або sessionStorage) ---
  async function restorePosition(behavior = 'auto') {
    let x = scrollX.value
    let y = scrollY.value

    if (storageKey && scrollPositionsStore.has(storageKey)) {
      const saved = scrollPositionsStore.get(storageKey)

      x = saved.x ?? 0
      y = saved.y ?? 0
    }

    // чекаємо наступний тік, щоб DOM встиг відрендеритись
    // (актуально коли відновлюємо позицію після навігації/списку даних)
    await nextTick()
    scrollTo(y, x, behavior)
  }

  // --- Очистити збережену позицію ---
  function clearSavedPosition() {
    scrollX.value = 0
    scrollY.value = 0

    if (storageKey)
      scrollPositionsStore.delete(storageKey)
  }

  // --- Обробник scroll-івенту (оновлює реактивні значення) ---
  function handleScroll() {
    const el = getElement()
    if (!el)
      return

    const pos = getScrollPosition(el)

    scrollX.value = pos.x
    scrollY.value = pos.y

    // перевірка чи ми на самому верху / низу
    isAtTop.value = pos.y <= 0

    const maxScroll
      = el === window
        ? document.documentElement.scrollHeight - window.innerHeight
        : el.scrollHeight - el.clientHeight

    isAtBottom.value = pos.y >= maxScroll - 1 // -1 для похибки округлення

    if (autoSave) {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(savePosition, saveDebounce)
    }
  }

  onMounted(() => {
    const el = getElement()
    if (!el)
      return

    el.addEventListener('scroll', handleScroll, { passive: true })

    if (autoRestore)
      restorePosition()
    else
      handleScroll() // ініціалізувати поточні значення
  })

  onBeforeUnmount(() => {
    const el = getElement()
    if (el)
      el.removeEventListener('scroll', handleScroll)

    clearTimeout(debounceTimer)

    // зберегти позицію перед розмонтуванням (корисно при переході між сторінками)
    if (autoSave)
      savePosition()
  })

  return {
    scrollX,
    scrollY,
    isAtTop,
    isAtBottom,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    savePosition,
    restorePosition,
    clearSavedPosition,
  }
}
