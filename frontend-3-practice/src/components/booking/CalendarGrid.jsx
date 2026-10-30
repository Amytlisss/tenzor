import { buildCalendarGrid, isDateSelectable, TODAY, WEEKDAYS_SHORT, MONTHS_GENITIVE } from '../../utils/date';

export default function CalendarGrid({ year, month, selectedDay, onDayClick }) {
  const weeks = buildCalendarGrid(year, month);

  return (
    <div className="calendar__grid" role="grid">
      {WEEKDAYS_SHORT.map((day) => (
        <span key={day} className="calendar__weekday">{day}</span>
      ))}
      
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} style={{ display: 'contents' }}>
          {week.map((day, dayIndex) => {
            if (day === null) {
              return <span key={`empty-${dayIndex}`} className="calendar__day calendar__day--muted" aria-hidden="true"></span>;
            }

            const selectable = isDateSelectable(day, month, year, TODAY);
            const isToday = day === TODAY.getDate() && month === TODAY.getMonth() && year === TODAY.getFullYear();
            const isSelected = day === selectedDay;

            let classes = 'calendar__day';
            if (!selectable) classes += ' calendar__day--disabled';
            if (isToday && selectable) classes += ' calendar__day--today';
            if (isSelected) classes += ' calendar__day--selected';

            if (selectable) {
              return (
                <button
                  key={day}
                  type="button"
                  className={classes}
                  onClick={() => onDayClick(day)}
                  aria-label={`${day} ${MONTHS_GENITIVE[month]} ${year}`}
                >
                  {day}
                </button>
              );
            }

            return (
              <span key={day} className={classes} aria-disabled="true">
                {day}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}