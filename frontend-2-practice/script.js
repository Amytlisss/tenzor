// 1. ДАННЫЕ

const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

const DAYS_OF_WEEK = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота'
];

const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Моковые данные слотов. Ключ: YYYY-MM-DD
const SLOTS_DATA = {
  '2026-10-22': [
    { time: '10:00', busy: false },
    { time: '11:00', busy: false },
    { time: '12:00', busy: false },
    { time: '13:00', busy: false },
    { time: '14:00', busy: true },  // Занят
    { time: '15:00', busy: false },
    { time: '16:00', busy: false },
    { time: '17:00', busy: false },
    { time: '18:00', busy: true },  // Занят
  ],
  '2026-10-23': [
    { time: '12:00', busy: false }, // Только обед, как в примере
    { time: '13:00', busy: false },
    { time: '14:00', busy: false },
  ],
  '2026-10-24': [
    { time: '10:00', busy: false },
    { time: '11:00', busy: false },
    { time: '12:00', busy: false },
    { time: '13:00', busy: false },
    { time: '14:00', busy: false },
    { time: '15:00', busy: false },
    { time: '16:00', busy: false },
    { time: '17:00', busy: false },
    { time: '18:00', busy: false },
  ]
};

const DEFAULT_SLOTS = [
  { time: '10:00', busy: false },
  { time: '11:00', busy: false },
  { time: '12:00', busy: false },
  { time: '13:00', busy: false },
  { time: '14:00', busy: false },
  { time: '15:00', busy: false },
  { time: '16:00', busy: false },
  { time: '17:00', busy: false },
  { time: '18:00', busy: false },
];


// 2. СОСТОЯНИЕ

const today = new Date();
today.setHours(0, 0, 0, 0); // Обнуляем время для корректного сравнения

const state = {
  currentYear: 2026,      // Начинаем с октября 2026, как в макете
  currentMonth: 9,        // 9 = Октябрь (0-индексный)
  selectedDay: 22,        // День по умолчанию
  selectedTime: null,     // Время пока не выбрано
  _selectedMonth: 9,      // Для отслеживания месяца выбранного дня
  _selectedYear: 2026,    // Для отслеживания года выбранного дня
};


// 3. ЧИСТЫЕ ФУНКЦИИ

function compareDates(date1, date2) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

function isDateSelectable(day, month, year, todayDate) {
  const date = new Date(year, month, day);
  return compareDates(date, todayDate) >= 0;
}

function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  let startWeekday = firstDay.getDay();
  startWeekday = startWeekday === 0 ? 6 : startWeekday - 1; // Пн=0, Вс=6

  const weeks = [];
  let currentWeek = [];

  for (let i = 0; i < startWeekday; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
}

function formatDateKey(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function getSlotsForDate(year, month, day) {
  const key = formatDateKey(year, month, day);
  return SLOTS_DATA[key] || DEFAULT_SLOTS;
}


// 4. РЕНДЕР

function renderCalendar() {
  const monthLabel = document.getElementById('calendar-month');
  const grid = document.getElementById('calendar-grid');

  monthLabel.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;

  const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);
  let html = '';

  // Дни недели
  WEEKDAYS_SHORT.forEach(day => {
    html += `<span class="calendar__weekday">${day}</span>`;
  });

  // Даты
  weeks.forEach(week => {
    week.forEach(day => {
      if (day === null) {
        html += `<span class="calendar__day calendar__day--muted" aria-hidden="true"></span>`;
        return;
      }

      const selectable = isDateSelectable(day, state.currentMonth, state.currentYear, today);
      const isToday = (day === today.getDate() && state.currentMonth === today.getMonth() && state.currentYear === today.getFullYear());
      const isSelected = (day === state.selectedDay && state.currentMonth === state._selectedMonth && state.currentYear === state._selectedYear);

      let classes = 'calendar__day';
      if (!selectable) classes += ' calendar__day--disabled';
      if (isToday && selectable) classes += ' calendar__day--today';
      if (isSelected) classes += ' calendar__day--selected';

      if (selectable) {
        html += `<button type="button" class="${classes}" data-day="${day}" aria-label="${day} ${MONTHS_GENITIVE[state.currentMonth]} ${state.currentYear}">${day}</button>`;
      } else {
        html += `<span class="${classes}" aria-disabled="true">${day}</span>`;
      }
    });
  });

  grid.innerHTML = html;

  // Навешиваем обработчики заново после перерисовки
  const dayButtons = grid.querySelectorAll('button.calendar__day');
  dayButtons.forEach(btn => {
    btn.addEventListener('click', onDayClick);
  });
}

function renderTimeSlots() {
  const title = document.getElementById('slots-title');
  const grid = document.getElementById('slots-grid');

  if (state.selectedDay === null) {
    title.textContent = 'Выберите дату';
    grid.innerHTML = '<p class="slots__empty">Нажмите на день в календаре, чтобы увидеть доступное время</p>';
    return;
  }

  const slots = getSlotsForDate(state.currentYear, state.currentMonth, state.selectedDay);
  const date = new Date(state.currentYear, state.currentMonth, state.selectedDay);
  const dayName = DAYS_OF_WEEK[date.getDay()];

  title.textContent = `${dayName}, ${state.selectedDay} ${MONTHS_GENITIVE[state.currentMonth]}`;

  let html = '';
  slots.forEach(slot => {
    let classes = 'slot';
    if (slot.busy) classes += ' slot--busy';
    if (slot.time === state.selectedTime && !slot.busy) classes += ' slot--selected';

    if (!slot.busy) {
      html += `<button type="button" class="${classes}" data-time="${slot.time}">${slot.time}</button>`;
    } else {
      html += `<button type="button" class="${classes}" disabled aria-label="${slot.time} занято">${slot.time}</button>`;
    }
  });

  grid.innerHTML = html;

  // Навешиваем обработчики заново
  const slotButtons = grid.querySelectorAll('button.slot:not(.slot--busy)');
  slotButtons.forEach(btn => {
    btn.addEventListener('click', onTimeSlotClick);
  });
}

function updateBottomBar() {
  const valueEl = document.getElementById('bottom-bar-value');
  const btn = document.getElementById('continue-btn');

  if (state.selectedDay !== null && state.selectedTime !== null) {
    const date = new Date(state.currentYear, state.currentMonth, state.selectedDay);
    const dayName = DAYS_OF_WEEK[date.getDay()];
    const dateStr = `${dayName}, ${state.selectedDay} ${MONTHS_GENITIVE[state.currentMonth]} ${state.currentYear}`;
    
    valueEl.textContent = `${dateStr} • ${state.selectedTime}`;
    btn.disabled = false;
  } else if (state.selectedDay !== null) {
    const date = new Date(state.currentYear, state.currentMonth, state.selectedDay);
    const dayName = DAYS_OF_WEEK[date.getDay()];
    const dateStr = `${dayName}, ${state.selectedDay} ${MONTHS_GENITIVE[state.currentMonth]} ${state.currentYear}`;
    
    valueEl.textContent = `${dateStr} • время не выбрано`;
    btn.disabled = true;
  } else {
    valueEl.textContent = 'Дата и время не выбраны';
    btn.disabled = true;
  }
}


// 5. ОБРАБОТЧИКИ

function onDayClick(event) {
  // Используем currentTarget, чтобы получить именно кнопку, а не вложенный текст
  const day = parseInt(event.currentTarget.dataset.day, 10);

  state.selectedDay = day;
  state._selectedMonth = state.currentMonth;
  state._selectedYear = state.currentYear;
  
  // Сбрасываем время при смене дня!
  state.selectedTime = null;

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  const time = event.currentTarget.dataset.time;
  state.selectedTime = time;

  renderTimeSlots(); // Перерисовываем, чтобы обновить класс --selected
  updateBottomBar();
}

function onPrevMonth() {
  state.currentMonth--;
  if (state.currentMonth < 0) {
    state.currentMonth = 11;
    state.currentYear--;
  }
  // При смене месяца сбрасываем выбор, если он вышел за пределы
  state.selectedDay = null;
  state.selectedTime = null;
  
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onNextMonth() {
  state.currentMonth++;
  if (state.currentMonth > 11) {
    state.currentMonth = 0;
    state.currentYear++;
  }
  state.selectedDay = null;
  state.selectedTime = null;
  
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onContinue() {
  if (state.selectedDay === null || state.selectedTime === null) return;
  
  const date = new Date(state.currentYear, state.currentMonth, state.selectedDay);
  const dayName = DAYS_OF_WEEK[date.getDay()];
  const dateStr = `${dayName}, ${state.selectedDay} ${MONTHS_GENITIVE[state.currentMonth]} ${state.currentYear}`;
  
  alert(`Запись подтверждена!\n\n${dateStr} в ${state.selectedTime}\n\nМастер: Алексей\nУслуга: Мужская стрижка`);
}


// 6. ИНИЦИАЛИЗАЦИЯ

function init() {
  // Устанавливаем день по умолчанию (например, 22 октября 2026, как в макете)
  // Но проверяем, не в прошлом ли он. Если в прошлом, берем today.
  const defaultDate = new Date(2026, 9, 22);
  if (compareDates(defaultDate, today) >= 0) {
    state.selectedDay = 22;
    state._selectedMonth = 9;
    state._selectedYear = 2026;
  } else {
    state.selectedDay = today.getDate();
    state._selectedMonth = today.getMonth();
    state._selectedYear = today.getFullYear();
    state.currentMonth = today.getMonth();
    state.currentYear = today.getFullYear();
  }

  // Первый рендер
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();

  // Навешиваем обработчики на стрелки и кнопку (они не перерисовываются, так что достаточно 1 раза)
  document.getElementById('prev-month').addEventListener('click', onPrevMonth);
  document.getElementById('next-month').addEventListener('click', onNextMonth);
  document.getElementById('continue-btn').addEventListener('click', onContinue);
}

// Запуск после полной загрузки DOM
document.addEventListener('DOMContentLoaded', init);