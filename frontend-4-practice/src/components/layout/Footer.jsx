export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <p className="footer__logo">BRAVO</p>
          <p className="footer__tagline">Место, где стиль становится привычкой.</p>
        </div>
        <div className="footer__contacts">
          <p className="footer__heading">Контакты</p>
          <p className="footer__text">Москва, ул. Покровка, 18</p>
          <p className="footer__text">Ежедневно · 10:00–22:00</p>
        </div>
        <div className="footer__reach">
          <p className="footer__heading">Связаться</p>
          <p className="footer__text">+7 (495) 123-45-67</p>
          <p className="footer__text">hello@bravo.barber</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__copy">© 2026 BRAVO BARBERSHOP</p>
        <a href="#" className="footer__policy">Политика конфиденциальности</a>
      </div>
    </footer>
  );
}