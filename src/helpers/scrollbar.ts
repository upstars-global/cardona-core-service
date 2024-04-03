export const scrollToBottom = (selector: string): void => {
  const scrollEl: HTMLElement | null = document.querySelector(selector)

  if (scrollEl)
    scrollEl.scrollTop = scrollEl.scrollHeight
}

export const scrollToElement = (selector: string) => {
  const element = document.querySelector(selector)
  if (element) {
    const elementRect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const scrollY = window.scrollY || window.pageYOffset

    const offsetY = elementRect.top + elementRect.height / 2 - windowHeight / 2

    window.scrollTo({
      top: scrollY + offsetY,
      behavior: 'smooth',
    })
  }
}
