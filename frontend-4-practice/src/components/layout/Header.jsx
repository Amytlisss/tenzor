export default function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <a href="#" className="header__logo">BRAVO</a>
        <nav className="header__nav">
          <a href="#" className="header__link">Услуги</a>
          <a href="#" className="header__link">Мастера</a>
          <a href="#" className="header__link">О нас</a>
          <a href="#" className="header__link">Отзывы</a>
          <a href="#" className="header__link header__link--active">Контакты</a>
        </nav>
      </div>
    </header>
  );
}