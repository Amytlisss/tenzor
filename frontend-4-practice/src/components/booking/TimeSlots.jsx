// src/components/booking/TimeSlots.jsx
import { DAYS_OF_WEEK, MONTHS_GENITIVE } from '../../utils/date';

export default function TimeSlots({ year, month, selectedDay, selectedTime, slots, isLoading, error, onTimeClick }) {
  if (!selectedDay) {
    return (
      <div className="slots">
        <h3 className="slots__title">Выберите дату</h3>
        <p className="slots__subtitle">Свободное время</p>
        <div className="slots__grid">
          <p className="slots__empty">Нажмите на день в календаре, чтобы увидеть доступное время</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="slots">
        <h3 className="slots__title">Загрузка...</h3>
        <div className="slots__grid">
          <p className="slots__empty">Получаем свободное время с сервера</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="slots">
        <h3 className="slots__title">Ошибка</h3>
        <div className="slots__grid">
          <p className="slots__empty" style={{ color: '#c0392b' }}>{error}</p>
        </div>
      </div>
    );
  }

  const date = new Date(year, month, selectedDay);
  const dayName = DAYS_OF_WEEK[date.getDay()];

  return (
    <div className="slots">
      <h3 className="slots__title">{dayName}, {selectedDay} {MONTHS_GENITIVE[month]}</h3>
      <p className="slots__subtitle">Свободное время</p>
      <div className="slots__grid">
        {slots.map((slot) => {
          let classes = 'slot';
          if (!slot.available) classes += ' slot--busy';
          if (slot.time === selectedTime && slot.available) classes += ' slot--selected';

          if (slot.available) {
            return (
              <button key={slot.time} type="button" className={classes} onClick={() => onTimeClick(slot.time)}>
                {slot.time}
              </button>
            );
          }

          return (
            <button key={slot.time} type="button" className={classes} disabled aria-label={`${slot.time} занято`}>
              {slot.time}
            </button>
          );
        })}
      </div>
    </div>
  );
}