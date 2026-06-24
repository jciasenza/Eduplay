import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/brand/BrandLogo';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
  const { signInWithGoogle, signInWithEmail, loading, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    const { error: signInError } = await signInWithEmail(email, password);
    setIsSubmitting(false);
    if (signInError) setError(signInError.message);
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <BrandLogo />
        <div className="auth-card__heading">
          <h1>Hola de nuevo</h1>
          <p>Ingresa para continuar tu aventura.</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleEmailLogin} className="auth-form">
          <label>
            Email
            <input
              className="input"
              type="email"
              placeholder="familia@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label>
            Contrasena
            <input
              className="input"
              type="password"
              placeholder="Tu contrasena"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading || isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'Cargando...' : 'Iniciar sesion'}
          </button>
        </form>
        <div className="auth-divider">o</div>
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading || isSubmitting}
          className="btn btn-google"
        >
          Entrar con Google
        </button>
        <p className="auth-card__footer">
          No tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </section>
  );
};
