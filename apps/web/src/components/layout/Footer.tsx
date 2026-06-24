import { BrandLogo } from '../brand/BrandLogo';

export const Footer = () => (
  <footer className="site-footer">
    <div className="container site-footer__inner">
      <BrandLogo compact />
      <div className="site-footer__links">
        <a href="#terms" target="_blank" rel="noreferrer">
          Condiciones de Servicio
        </a>
        <a href="#privacy" target="_blank" rel="noreferrer">
          Politica de Privacidad
        </a>
        <a href="#contacto">Contacto</a>
      </div>
      <p>©2026 CureSoft. Todos los derechos reservados.</p>
    </div>
  </footer>
);
