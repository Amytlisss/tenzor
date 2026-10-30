import { useState } from 'react';
import { TODAY } from '../utils/date';
import CalendarHeader from '../components/booking/CalendarHeader';
import CalendarGrid from '../components/booking/CalendarGrid';
import TimeSlots from '../components/booking/TimeSlots';
import BookingBottomBar from '../components/booking/BookingBottomBar';

export default function BookingScreen() {
  const isCurrentMonth = TODAY.getMonth() === 9 && TODAY.getFullYear() === 2026;
  const defaultDay = isCurrentMonth ? TODAY.getDate() : 22;
  const defaultMonth = isCurrentMonth ? TODAY.getMonth() : 9;
  const defaultYear = isCurrentMonth ? TODAY.getFullYear() : 2026;

  const [currentYear, setCurrentYear] = useState(defaultYear);
  const [currentMonth, setCurrentMonth] = useState(defaultMonth);
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setSelectedTime(null); // СБРОС ВРЕМЕНИ (важное требование задания!)
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); } 
    else { setCurrentMonth((m) => m - 1); }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); } 
    else { setCurrentMonth((m) => m + 1); }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleContinue = () => {
    alert('Запись подтверждена! (Демонстрация)');
  };

  return (
    <main className="main">
      <div className="main__container">
        <p className="main__step-label">Шаг 3 из 5</p>
        <h1 className="main__title">Дата и время</h1>
        <p className="main__subtitle">Выберите удобный день и свободное время для визита.</p>

        <div className="booking">
          <div className="calendar">
            <CalendarHeader year={currentYear} month={currentMonth} onPrev={handlePrevMonth} onNext={handleNextMonth} />
            <CalendarGrid year={currentYear} month={currentMonth} selectedDay={selectedDay} onDayClick={handleDayClick} />
          </div>
          <TimeSlots year={currentYear} month={currentMonth} selectedDay={selectedDay} selectedTime={selectedTime} onTimeClick={handleTimeClick} />
        </div>

        <BookingBottomBar year={currentYear} month={currentMonth} selectedDay={selectedDay} selectedTime={selectedTime} onContinue={handleContinue} />

        <div className="actions">
          <a href="#" className="actions__back">← Назад к услугам</a>
        </div>
      </div>
    </main>
  );
}