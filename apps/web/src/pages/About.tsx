import { Link } from 'react-router-dom';
import { APP_NAME, APP_OWNER, APP_VERSION } from '@aventuras/shared';
import { useScrollReveal } from '../hooks/useScrollReveal';

const productDetails = [
  ['Version', APP_VERSION],
  ['Producto', 'Plataforma SaaS educativa'],
  ['Estado', 'MVP en desarrollo'],
  ['Equipo', APP_OWNER],
];

export const About = () => {
  useScrollReveal();

  return (
    <section className="info-page about-page">
      <div className="container info-page__inner">
        <div className="info-hero reveal fade-up" data-reveal>
          <span className="eyebrow">Acerca de</span>
          <h1>{APP_NAME} convierte el aprendizaje en juego</h1>
          <p>
            EduPlay es una experiencia educativa para familias, con mundos tematicos, niveles
            cortos, perfiles infantiles y planes premium para desbloquear contenido adicional.
          </p>
        </div>

        <div className="about-grid">
          <article className="about-card reveal fade-up" data-reveal>
            <h2>Informacion del producto</h2>
            <dl className="version-list">
              {productDetails.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </article>

          <article className="about-card reveal fade-up" data-reveal>
            <h2>Que incluye</h2>
            <ul className="about-list">
              <li>Mundos de matematicas, palabras, ciencias, historia y logica.</li>
              <li>Panel familiar para administrar perfiles y suscripcion.</li>
              <li>Integracion preparada para Stripe y Supabase.</li>
              <li>Formulario de contacto y paginas legales basicas.</li>
            </ul>
          </article>
        </div>

        <div className="about-actions reveal fade-up" data-reveal>
          <Link className="btn btn-primary" to="/dashboard">
            Ir al panel
          </Link>
          <Link className="btn btn-ghost" to="/contact">
            Contactar soporte
          </Link>
        </div>
      </div>
    </section>
  );
};
