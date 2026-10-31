import { useState, useEffect } from 'react';
import { fetchToday, fetchSlots } from '../api';
import CalendarHeader from '../components/booking/CalendarHeader';
import CalendarGrid from '../components/booking/CalendarGrid';
import TimeSlots from '../components/booking/TimeSlots';
import BookingBottomBar from '../components/booking/BookingBottomBar';
import { isDateSelectable, compareDates } from '../utils/date';

export default function BookingScreen() {
  // Состояние для "сегодня"
  const [todayData, setTodayData] = useState(null);
  const [isTodayLoading, setIsTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);

  // Состояние для выбранной даты
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Состояние для слотов
  const [slots, setSlots] = useState([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // 1. Загружаем "сегодня" при первом рендере
  useEffect(() => {
    fetchToday()
      .then(data => {
        setTodayData(data);
        setCurrentYear(data.year);
        setCurrentMonth(data.month);
        setSelectedDay(data.day); // Выбираем сегодняшний день по умолчанию
      })
      .catch(err => setTodayError(err.message))
      .finally(() => setIsTodayLoading(false));
  }, []);

  // 2. Загружаем слоты при изменении выбранного дня, месяца или года
  useEffect(() => {
    if (!selectedDay || !todayData) return;

    setIsSlotsLoading(true);
    setSlotsError(null);

    // Формируем ожидаемую дату для защиты от гонок (race condition)
    const expectedDateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;

    fetchSlots(selectedDay, currentMonth, currentYear)
      .then(response => {
        // Защита от гонок: если пользователь уже переключил день, игнорируем старый ответ
        if (response.date === expectedDateKey) {
          setSlots(response.slots);
          setSelectedTime(null); // Сбрасываем время при смене дня
        }
      })
      .catch(err => setSlotsError(err.message))
      .finally(() => setIsSlotsLoading(false));
  }, [selectedDay, currentMonth, currentYear, todayData]);

  const handleDayClick = (day) => {
    // Проверяем, можно ли выбрать этот день
    const todayDateObj = new Date(todayData.year, todayData.month, todayData.day);
    if (!isDateSelectable(day, currentMonth, currentYear, todayDateObj)) return;

    setSelectedDay(day);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleContinue = () => {
    alert('Запись подтверждена! (Демонстрация)');
  };

  // Показываем загрузку всей страницы, если "сегодня" еще не пришло
  if (isTodayLoading) {
    return (
      <main className="main">
        <div className="main__container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>Загрузка данных...</h2>
        </div>
      </main>
    );
  }

  if (todayError) {
    return (
      <main className="main">
        <div className="main__container" style={{ textAlign: 'center', padding: '100px 0', color: '#c0392b' }}>
          <h2>Ошибка: {todayError}</h2>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Попробовать снова
          </button>
        </div>
      </main>
    );
  }

  const todayDateObj = new Date(todayData.year, todayData.month, todayData.day);

  return (
    <main className="main">
      <div className="main__container">
        <p className="main__step-label">Шаг 3 из 5</p>
        <h1 className="main__title">Дата и время</h1>
        <p className="main__subtitle">Выберите удобный день и свободное время для визита.</p>

        <div className="booking">
          <div className="calendar">
            <CalendarHeader 
              year={currentYear} 
              month={currentMonth} 
              onPrev={handlePrevMonth} 
              onNext={handleNextMonth} 
            />
            <CalendarGrid 
              year={currentYear} 
              month={currentMonth} 
              selectedDay={selectedDay} 
              onDayClick={handleDayClick}
              todayDate={todayDateObj}
            />
          </div>

          <TimeSlots 
            year={currentYear} 
            month={currentMonth} 
            selectedDay={selectedDay} 
            selectedTime={selectedTime} 
            slots={slots}
            isLoading={isSlotsLoading}
            error={slotsError}
            onTimeClick={handleTimeClick} 
          />
        </div>

        <BookingBottomBar 
          year={currentYear} 
          month={currentMonth} 
          selectedDay={selectedDay} 
          selectedTime={selectedTime} 
          onContinue={handleContinue} 
        />

        <div className="actions">
          <a href="#" className="actions__back">← Назад к услугам</a>
        </div>
      </div>
    </main>
  );
}