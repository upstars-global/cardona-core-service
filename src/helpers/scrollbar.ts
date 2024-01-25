export enum ScrollBehavior {
  Auto = 'auto',
  Smooth = 'smooth',
}

export enum ScrollAlignment {
  Start = 'start',
  Center = 'center',
  End = 'end',
  Nearest = 'nearest',
}

interface ScrollOptions {
  behavior?: ScrollBehavior
  block?: ScrollAlignment
  inline?: ScrollAlignment
}

const defaultOptions: ScrollOptions = {
  behavior: ScrollBehavior.Smooth,
  block: ScrollAlignment.Center,
  inline: ScrollAlignment.End,
}

export const scrollToBottom = (selector: string): void => {
  const scrollEl: HTMLElement | null = document.querySelector(selector)

  if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight
}
export const scrollToElement = (
  selector: string,
  options: ScrollOptions = defaultOptions
): void => {
  const scrollEl: HTMLElement | null = document.querySelector(selector)
  if (scrollEl) scrollEl.scrollIntoView(options)
}
