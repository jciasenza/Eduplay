import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/brand/BrandLogo';
import { useAuth } from '../hooks/useAuth';

export const Register = () => {
  const { signUpWithEmail, signInWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleEmailRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);
    const cleanName = name.trim();
    const { error: signUpError } = await signUpWithEmail(cleanName, email, password);
    setIsSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setMessage('Registro exitoso. Revisa tu email para confirmar la cuenta.');
  };

  return (
    <section className="auth-page">
      <div className="auth-card auth-card--register">
        <BrandLogo />
        <div className="auth-card__heading">
          <h1>Suma tu familia</h1>
          <p>Crea una cuenta y empieza con los niveles gratis.</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        <form onSubmit={handleEmailRegister} className="auth-form">
          <label>
            Nombre
            <input
              className="input"
              type="text"
              placeholder="Nombre de la familia"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              autoComplete="name"
            />
          </label>
          <label>
            Email
            <input
              className="input"
              type="email"
              placeholder="familia@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
            />
          </label>
          <label>
            Contrasena
            <input
              className="input"
              type="password"
              placeholder="Minimo 6 caracteres"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          <button type="submit" disabled={loading || isSubmitting} className="btn btn-secondary">
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <div className="auth-divider">o</div>
        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={loading || isSubmitting}
          className="btn btn-google"
        >
          Registrarme con Google
        </button>
        <p className="auth-card__footer">
          Ya tienes cuenta? <Link to="/login">Ingresar</Link>
        </p>
      </div>
    </section>
  );
};
