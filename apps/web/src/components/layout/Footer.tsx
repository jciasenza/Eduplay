import { Link } from 'react-router-dom';
import { APP_VERSION } from '@aventuras/shared';
import { BrandLogo } from '../brand/BrandLogo';

export const Footer = () => (
  <footer className="site-footer">
    <div className="container site-footer__inner">
      <BrandLogo compact />
      <div className="site-footer__links">
        <Link to="/terms">
          Condiciones de Servicio
        </Link>
        <Link to="/privacy">
          Politica de Privacidad
        </Link>
        <Link to="/contact">Contacto</Link>
        <Link to="/about">Acerca de</Link>
      </div>
      <p>©2026 CureSoft. v{APP_VERSION}. Todos los derechos reservados.</p>
    </div>
  </footer>
);
