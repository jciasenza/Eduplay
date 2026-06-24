import { Link } from 'react-router-dom';

export const NotFound = () => (
  <section className="not-found-page">
    <div className="container not-found-page__inner">
      <span className="eyebrow">404</span>
      <h1>Esta pantalla no existe.</h1>
      <p>Volvamos al mapa principal para seguir jugando.</p>
      <Link to="/" className="btn btn-primary">
        Ir al inicio
      </Link>
    </div>
  </section>
);
