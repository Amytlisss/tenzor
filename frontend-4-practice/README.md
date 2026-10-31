# BRAVO Barbershop — Страница «Дата и время» (Задание 4. Асинхронный JavaScript и React)

Интерактивная страница выбора даты и времени для сайта барбершопа BRAVO, реализованная на React с подключением имитационного сервера. Данные о текущей дате и доступных слотах приходят через fetch-запросы к API, а не захардкожены в коде. Реализованы состояния загрузки, обработка ошибок и защита от гонок запросов.

## Структура проекта
frontend-3-practice/
├── public/
│ └── icons.svg
├── src/
│ ├── components/
│ │ ├── booking/
│ │ │ ├── BookingBottomBar.jsx
│ │ │ ├── CalendarGrid.jsx
│ │ │ ├── CalendarHeader.jsx
│ │ │ └── TimeSlots.jsx
│ │ └── layout/
│ │ ├── Footer.jsx
│ │ ├── Header.jsx
│ │ └── ProgressBar.jsx
│ ├── data/
│ │ └── slots.js
│ ├── screens/
│ │ └── BookingScreen.jsx
│ ├── utils/
│ │ └── date.js
│ ├── App.css
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md


## Запуск проекта

1. Установите зависимости:
   ```bash
   npm install

2. Запустите сервер разработки:
    ```bash
    npm run dev

3. Откройте в браузере адрес, указанный в терминале

Реализованная функциональность
При открытии страницы по умолчанию выбрано сегодняшнее число (если оно попадает в октябрь 2026 года), иначе — 22 октября 2026.
Клик по дню календаря делает его выбранным, обновляет список слотов и сбрасывает ранее выбранное время.
Клик 