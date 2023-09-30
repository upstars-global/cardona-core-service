export const scrollToBottom = (selector: string): void => {
  const scrollEl: HTMLElement | null = document.querySelector(selector)

  if (scrollEl)
    scrollEl.scrollTop = scrollEl.scrollHeight
}
