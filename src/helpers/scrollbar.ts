export const scrollToBottom = (selector: string): void => {
  const scrollEl: HTMLElement | null = document.querySelector(selector)

  if (scrollEl)
    scrollEl.scrollTop = scrollEl.scrollHeight
}

export const scrollToElement = (selector: string, offsetY = 0) => {
  const element = document.querySelector(selector)
  if (element) {
    const elementTop = element.getBoundingClientRect().top + window.scrollY

    window.scrollTo({
      top: elementTop - offsetY,
      behavior: 'smooth',
    })
  }
}
