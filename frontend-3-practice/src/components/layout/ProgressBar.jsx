export default function ProgressBar() {
  const steps = [
    { num: 1, label: 'Мастер', status: 'done' },
    { num: 2, label: 'Услуга', status: 'done' },
    { num: 3, label: 'Дата и время', status: 'active' },
    { num: 4, label: 'Контакты', status: 'pending' },
    { num: 5, label: 'Готово', status: 'pending' },
  ];

  return (
    <section className="progress" aria-label="Прогресс записи">
      <div className="progress__container">
        {steps.map((step, index) => (
          <div key={step.num} className={`progress__step progress__step--${step.status}`}>
            <span className="progress__circle">{step.num}</span>
            <span className="progress__label">{step.label}</span>
            {index < steps.length - 1 && (
              <div className={`progress__line ${step.status === 'done' ? 'progress__line--done' : ''}`}></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}