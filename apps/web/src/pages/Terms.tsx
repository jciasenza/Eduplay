import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const Terms = () => {
  useScrollReveal();

  return (
    <section className="info-page">
      <div className="container info-page__inner">
        <div className="info-hero reveal fade-up" data-reveal>
          <span className="eyebrow">Condiciones de Servicio</span>
          <h1>Terminos de uso de EduPlay</h1>
          <p>
            Estas condiciones describen las reglas basicas para usar la plataforma educativa
            EduPlay.
          </p>
        </div>

        <article className="legal-card reveal fade-up" data-reveal>
          <p className="legal-updated">Ultima actualizacion: 25 de junio de 2026</p>

          <h2>1. Uso de la plataforma</h2>
          <p>
            EduPlay ofrece juegos y contenidos educativos para familias. El adulto responsable debe
            crear y administrar la cuenta, supervisar el uso de los perfiles infantiles y mantener
            actualizada la informacion de acceso.
          </p>

          <h2>2. Cuentas y perfiles</h2>
          <p>
            Cada cuenta puede incluir uno o mas perfiles de juego segun el plan contratado. El
            usuario se compromete a no compartir credenciales fuera de su grupo familiar y a
            informar cualquier acceso no autorizado.
          </p>

          <h2>3. Suscripciones</h2>
          <p>
            Los planes premium desbloquean mundos, niveles y funciones adicionales. Los pagos son procesados de forma segura a través de Mercado Pago.
          </p>

          <h2>4. Contenido educativo</h2>
          <p>
            El contenido esta pensado como apoyo ludico al aprendizaje. No reemplaza la orientacion
            de docentes, profesionales ni adultos responsables.
          </p>

          <h2>5. Conducta permitida</h2>
          <p>
            No esta permitido intentar vulnerar la seguridad del servicio, copiar contenidos sin
            autorizacion, interferir con el funcionamiento de la plataforma o usarla para fines no
            educativos.
          </p>

          <h2>6. Cambios del servicio</h2>
          <p>
            Podemos actualizar niveles, mundos, precios, funciones o estas condiciones para mejorar
            la experiencia. Los cambios relevantes se comunicaran dentro de la plataforma o por los
            canales de contacto disponibles.
          </p>

          <div className="legal-actions">
            <Link className="btn btn-primary" to="/contact">
              Consultar condiciones
            </Link>
            <Link className="btn btn-ghost" to="/privacy">
              Ver privacidad
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
};
