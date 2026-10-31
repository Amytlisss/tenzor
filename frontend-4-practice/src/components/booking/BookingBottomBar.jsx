import { DAYS_OF_WEEK, MONTHS_GENITIVE } from '../../utils/date';

export default function BookingBottomBar({ year, month, selectedDay, selectedTime, onContinue }) {
  const isComplete = selectedDay !== null && selectedTime !== null;
  let displayText = 'Дата и время не выбраны';
  
  if (selectedDay !== null) {
    const date = new Date(year, month, selectedDay);
    const dayName = DAYS_OF_WEEK[date.getDay()];
    const dateStr = `${dayName}, ${selectedDay} ${MONTHS_GENITIVE[month]} ${year}`;
    displayText = selectedTime ? `${dateStr} • ${selectedTime}` : `${dateStr} • время не выбрано`;
  }

  return (
    <div className="bottom-bar">
      <div className="bottom-bar__info">
        <span className="bottom-bar__label">Выбрано:</span>
        <span className="bottom-bar__value">{displayText}</span>
      </div>
      <button type="button" className="bottom-bar__button" disabled={!isComplete} onClick={onContinue}>
        Продолжить →
      </button>
    </div>
  );
}