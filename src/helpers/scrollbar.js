export const scrollToBottom = (selector) => {
    const scrollEl = document.querySelector(selector);
    if (scrollEl)
        scrollEl.scrollTop = scrollEl.scrollHeight;
};
//# sourceMappingURL=scrollbar.js.map