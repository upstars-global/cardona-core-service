export const scrollToBottom = (selector: string): void => {
  const scrollEl: HTMLElement | null = document.querySelector(selector)

  if (scrollEl)
    scrollEl.scrollTop = scrollEl.scrollHeight
}

export const scrollToElement = (selector: string) => {
  const element = document.querySelector(selector)
  if (!element)
    return

  element.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}
