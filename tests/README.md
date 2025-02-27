# Unit test

## 1. Основные проверки

### Рендеринг компонента

- Проверить, что компонент корректно рендерится без ошибок.
- Убедиться, что DOM-элементы отрисованы в соответствии с переданными пропсами.

### Работа с пропсами

- Проверить, что компонент корректно использует переданные пропсы.
- Убедиться, что значения по умолчанию применяются, если пропсы не заданы.

### Реакция на пользовательские события

- Проверить, что обработчики событий (например, `click`, `input` `...`) вызываются корректно.
- Убедиться, что события эмитируются с правильными данными.

### Рендеринг условных элементов

- Убедиться, что элементы правильно отображаются/скрываются в зависимости от состояния или пропсов.

---

## 2. Интеракции и состояние

### Обработка событий

- Проверить, что методы компонента вызываются при взаимодействии (например, при клике).
- Убедиться, что события, такие как `emit`, отправляют правильные данные.

### Работа со слотом

- Проверить, что переданные слоты корректно отображаются в компоненте.

### Асинхронное поведение

- Убедиться, что асинхронные действия (например, API-запросы) обрабатываются корректно.
- Проверить переходы состояния до и после выполнения асинхронного действия.

---

## 3. Интеграция с внешними зависимостями

### Vuex Store

- Проверить, что действия (`dispatch`) вызываются с корректными параметрами.
- Убедиться, что геттеры возвращают ожидаемые данные.

### Vue Router

- Убедиться, что переходы между маршрутами работают корректно.
- Проверить использование роутер-зависимых данных (например, `route.params`).

---

## 4. Тестирование ошибок

- Проверить, как компонент обрабатывает некорректные пропсы.
- Убедиться, что ошибки отлавливаются и корректно обрабатываются.


## 5. Чистота тестов

- Убедитесь, что тесты изолированы и не зависят друг от друга.
- Очищайте моки и фейковые таймеры после каждого теста:
```javascript
/// Example
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
```

# Базовая структура:
 - Подготовку данных и вспомогательных функций.
 - Использование моков для изоляции тестов.
 - Тесты на рендеринг, взаимодействие, асинхронность и состояние.
 - Очистку окружения после выполнения тестов.


# Что игнорировать при написании юнит-тестов
* Сторонние библиотеки
Не тестируйте функциональность библиотек вроде Lodash или Axios. Используйте моки и проверяйте только интеграцию с вашим кодом.
* Стили и вёрстку
Избегайте проверки конкретных значений стилей (цвета, отступы). Достаточно проверить наличие CSS-классов или отображение элементов.
* Глобальные зависимости
Не тестируйте реальные Vuex, Vue Router или API. Используйте моки для изоляции.
* Взаимодействие компонентов
Юнит-тесты фокусируются на одном компоненте. Тесты интеграции оставьте для другой фазы.
* Реальные API-запросы
Не отправляйте запросы в сеть. Используйте моки для данных.
* Внутренняя реализация
Проверяйте результат работы компонента (рендеринг, события), а не детали его реализации.
* Окружение (дата/время)
Не завязывайтесь на системное время или случайные значения. Используйте моки для предсказуемости.
* Тривиальный код
Не проверяйте очевидные условия или строки, не влияющие на логику компонента.
