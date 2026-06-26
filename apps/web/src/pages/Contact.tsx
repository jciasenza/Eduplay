import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

const SUPPORT_EMAIL = 'curejuan@hotmail.com';

export const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  useScrollReveal();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') ?? '');
    const email = String(formData.get('email') ?? '');
    const topic = String(formData.get('topic') ?? 'Soporte');
    const message = String(formData.get('message') ?? '');

    try {
      setStatus('sending');
      setError('');
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL ||
        import.meta.env.VITE_API_URL ||
        'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, topic, message }),
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar la consulta.');
      }

      setStatus('sent');
      event.currentTarget.reset();
    } catch (sendError) {
      const messageText =
        sendError instanceof Error ? sendError.message : 'No se pudo enviar la consulta.';
      setError(`${messageText} Tambien podes escribir a ${SUPPORT_EMAIL}.`);
      setStatus('error');
    }
  };

  return (
    <section className="info-page contact-page">
      <div className="container info-page__inner">
        <div className="info-hero reveal fade-up" data-reveal>
          <span className="eyebrow">Contacto</span>
          <h1>Hablemos sobre EduPlay</h1>
          <p>
            Escribinos por dudas de cuenta, suscripciones, soporte familiar o propuestas para
            nuevos contenidos educativos.
          </p>
        </div>

        <div className="contact-grid">
          <form className="contact-form reveal fade-up" data-reveal onSubmit={handleSubmit}>
            {status === 'sent' && (
              <div className="alert alert-success">
                Consulta enviada. Te responderemos desde {SUPPORT_EMAIL}.
              </div>
            )}
            {status === 'error' && <div className="alert alert-error">{error}</div>}
            <label>
              Nombre
              <input className="input" name="name" placeholder="Nombre de la familia" required />
            </label>
            <label>
              Email
              <input
                className="input"
                name="email"
                type="email"
                placeholder="familia@email.com"
                required
              />
            </label>
            <label>
              Motivo
              <select className="input" name="topic" defaultValue="support">
                <option value="Soporte de cuenta">Soporte de cuenta</option>
                <option value="Suscripcion y facturacion">Suscripcion y facturacion</option>
                <option value="Contenido educativo">Contenido educativo</option>
                <option value="Otra consulta">Otra consulta</option>
              </select>
            </label>
            <label>
              Mensaje
              <textarea
                className="input contact-form__message"
                name="message"
                placeholder="Contanos como podemos ayudarte"
                required
                minLength={10}
              />
            </label>
            <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Enviando...' : 'Enviar consulta'}
            </button>
          </form>

          <aside className="contact-panel reveal fade-up" data-reveal>
            <h2>Canales de ayuda</h2>
            <p>
              Para consultas urgentes de facturacion, incluye el email de la cuenta y el plan
              contratado.
            </p>
            <div className="contact-methods">
              <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
              <Link to="/account">Administrar cuenta familiar</Link>
              <Link to="/subscribe">Ver planes disponibles</Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};
