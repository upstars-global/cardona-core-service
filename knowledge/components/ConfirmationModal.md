---
title: ConfirmationModal
type: component
source: src/components/BaseModal/ConfirmationModal.vue
source_hash: 45d96984f358
tags: [modal]
updated: 2026-10-20
---

# ConfirmationModal

Типовая модалка подтверждения поверх `BaseModal`: заголовок, текст, кнопки Cancel / действие.

## Что неочевидно

- **Форма события `confirmed` зависит от того, открыта ли модалка с `payload`.** С payload эмитится `{ payload, hide }`, без него — сама функция `hide`. Обработчик обязан различать оба случая.
- **Модалка сама себя не закрывает при подтверждении.** Закрытие — ответственность обработчика (`hide()`); Cancel закрывает сам.
- **Кнопка действия блокируется и показывает loading только если передан `loadingUrls`** — состояние берётся из `loaderStore.isLoadingEndpoint`. Без него двойной клик не защищён.
- Цвет кнопки по умолчанию `VColors.Error` (рассчитано на удаление); для нейтральных подтверждений передавайте `actionBtnColor` явно.
