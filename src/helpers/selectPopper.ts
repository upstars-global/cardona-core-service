import { createPopper } from '@popperjs/core'

export const withPopper = (toggleDropdownCb?: CallableFunction) => (dropdownList, component, { width }) => {
  dropdownList.style.width = width

  const popper = createPopper(component.$refs.toggle, dropdownList, {
    placement: 'bottom',
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
          toggleDropdownCb?.({ dropdownList, component, state })
        },
      },
    ],
  })

  return () => popper.destroy()
}
