import { createPopper } from '@popperjs/core'

export const withPopper = (dropdownList, component, { width }) => {
  dropdownList.style.width = width

  const popper = createPopper(component.$refs.toggle, dropdownList, {
    placement: 'top',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 10],
        },
      },
      {
        name: 'toggleClass',
        enabled: true,
        phase: 'write',
        fn({ state }) {
          component.$el.classList.toggle('drop-up', state.placement === 'top')
        },
      },
    ],
  })

  return () => popper.destroy()
}
