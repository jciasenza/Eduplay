import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const Privacy = () => {
  useScrollReveal();

  return (
    <section className="info-page">
      <div className="container info-page__inner">
        <div className="info-hero reveal fade-up" data-reveal>
          <span className="eyebrow">Politica de Privacidad</span>
          <h1>Como cuidamos los datos familiares</h1>
          <p>
            Esta politica resume que informacion usamos para operar EduPlay y como se protege la
            experiencia de los chicos.
          </p>
        </div>

        <article className="legal-card reveal fade-up" data-reveal>
          <p className="legal-updated">Ultima actualizacion: 25 de junio de 2026</p>

          <h2>1. Informacion que recopilamos</h2>
          <p>
            Podemos usar datos de cuenta como nombre familiar, email, metodo de autenticacion,
            estado de suscripcion y perfiles infantiles creados por el adulto responsable.
          </p>

          <h2>2. Datos de juego</h2>
          <p>
            Guardamos progreso, niveles completados, estrellas, intentos y preferencias basicas para
            personalizar la experiencia educativa y mostrar avances dentro del panel familiar.
          </p>

          <h2>3. Pagos</h2>
          <p>
            Los pagos se procesan mediante Stripe. EduPlay no almacena numeros completos de tarjeta.
            Conservamos identificadores de cliente o suscripcion necesarios para administrar el plan.
          </p>

          <h2>4. Uso de la informacion</h2>
          <p>
            Usamos los datos para autenticar usuarios, habilitar contenidos, guardar progreso,
            brindar soporte, prevenir abuso y mejorar la plataforma.
          </p>

          <h2>5. Proteccion de menores</h2>
          <p>
            Los perfiles infantiles estan pensados para uso supervisado. Evitamos pedir informacion
            sensible innecesaria y centralizamos la administracion en la cuenta del adulto
            responsable.
          </p>

          <h2>6. Derechos y contacto</h2>
          <p>
            El adulto responsable puede solicitar acceso, correccion o eliminacion de datos de la
            cuenta escribiendo al equipo de soporte.
          </p>

          <div className="legal-actions">
            <Link className="btn btn-primary" to="/contact">
              Contactar soporte
            </Link>
            <Link className="btn btn-ghost" to="/terms">
              Ver condiciones
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
};
