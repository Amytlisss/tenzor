import { MONTHS_NOMINATIVE } from '../../utils/date';

export default function CalendarHeader({ year, month, onPrev, onNext }) {
  return (
    <div className="calendar__header">
      <h2 className="calendar__month">{MONTHS_NOMINATIVE[month]} {year}</h2>
      <div className="calendar__nav">
        <button className="calendar__arrow" type="button" onClick={onPrev} aria-label="Предыдущий месяц">‹</button>
        <button className="calendar__arrow" type="button" onClick={onNext} aria-label="Следующий месяц">›</button>
      </div>
    </div>
  );
}