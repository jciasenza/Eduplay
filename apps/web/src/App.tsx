import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

const Landing = () => <div className="container" style={{paddingTop: 'var(--header-height)'}}><h1>Aventuras del Saber</h1><p>Landing Page Placeholder</p></div>;

const Login = () => {
  const { signInWithGoogle, signInWithEmail, loading, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    const { error: signInError } = await signInWithEmail(email, password);
    setIsSubmitting(false);
    if (signInError) setError(signInError.message);
  };

  return (
    <div className="container flex flex-col items-center justify-center gap-6" style={{paddingTop: '100px'}}>
      <div className="card text-center" style={{maxWidth: '400px', width: '100%'}}>
        <h1 style={{color: 'var(--color-primary-light)', marginBottom: 'var(--space-2)'}}>¡Hola de nuevo!</h1>
        <p style={{color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)'}}>Ingresa para continuar tu aventura</p>
        
        {error && <div style={{color: 'var(--color-danger)', marginBottom: 'var(--space-4)', fontSize: '0.9rem'}}>{error}</div>}

        <form onSubmit={handleEmailLogin} style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%', marginBottom: 'var(--space-4)'}}>
          <input 
            type="email" 
            placeholder="Tu email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff'}}
          />
          <input 
            type="password" 
            placeholder="Tu contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff'}}
          />
          <button 
            type="submit"
            disabled={loading || isSubmitting}
            className="btn btn-primary" 
            style={{width: '100%', marginTop: 'var(--space-2)'}}
          >
            {isSubmitting ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{margin: 'var(--space-4) 0', color: 'var(--color-text-secondary)', fontSize: '0.9rem'}}>O ingresa con</div>

        <button 
          type="button"
          onClick={signInWithGoogle} 
          disabled={loading || isSubmitting}
          className="btn btn-secondary" 
          style={{width: '100%', backgroundColor: '#fff', color: '#333'}}
        >
          Entrar con Google
        </button>

        <p style={{marginTop: 'var(--space-6)', fontSize: '0.9rem'}}>
          ¿No tienes cuenta? <a href="/register" style={{color: 'var(--color-primary-light)'}}>Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
};

const Register = () => {
  const { signUpWithEmail, signInWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setIsSubmitting(true);
    const { error: signUpError } = await signUpWithEmail(email, password);
    setIsSubmitting(false);
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMsg('¡Registro exitoso! Por favor revisa tu email para confirmar tu cuenta.');
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center gap-6" style={{paddingTop: '100px'}}>
      <div className="card text-center" style={{maxWidth: '400px', width: '100%'}}>
        <h1 style={{color: 'var(--color-secondary)', marginBottom: 'var(--space-2)'}}>¡Súmate a la Aventura!</h1>
        <p style={{color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)'}}>Crea una cuenta para tu familia</p>
        
        {error && <div style={{color: 'var(--color-danger)', marginBottom: 'var(--space-4)', fontSize: '0.9rem'}}>{error}</div>}
        {msg && <div style={{color: 'var(--color-success)', marginBottom: 'var(--space-4)', fontSize: '0.9rem'}}>{msg}</div>}

        <form onSubmit={handleEmailRegister} style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', width: '100%', marginBottom: 'var(--space-4)'}}>
          <input 
            type="email" 
            placeholder="Tu email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff'}}
          />
          <input 
            type="password" 
            placeholder="Crea una contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{width: '100%', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', color: '#fff'}}
          />
          <button 
            type="submit"
            disabled={loading || isSubmitting}
            className="btn btn-secondary" 
            style={{width: '100%', marginTop: 'var(--space-2)'}}
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div style={{margin: 'var(--space-4) 0', color: 'var(--color-text-secondary)', fontSize: '0.9rem'}}>O regístrate con</div>

        <button 
          type="button"
          onClick={signInWithGoogle} 
          disabled={loading || isSubmitting}
          className="btn btn-secondary" 
          style={{width: '100%', backgroundColor: '#fff', color: '#333'}}
        >
          Regístrate con Google
        </button>

        <p style={{marginTop: 'var(--space-6)', fontSize: '0.9rem'}}>
          ¿Ya tienes cuenta? <a href="/login" style={{color: 'var(--color-secondary)'}}>Inicia sesión</a>
        </p>
      </div>
    </div>
  );
};
const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="container flex flex-col" style={{paddingTop: 'calc(var(--header-height) + 40px)'}}>
      <h1 style={{fontSize: '2.5rem', marginBottom: 'var(--space-2)'}}>Panel Familiar</h1>
      <p style={{color: 'var(--color-text-secondary)', marginBottom: 'var(--space-8)'}}>Bienvenido, {user?.email}</p>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)'}}>
        
        {/* Mundo Matemáticas */}
        <div className="card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
          <div style={{fontSize: '4rem', marginBottom: 'var(--space-4)'}}>🔢</div>
          <h2 style={{color: 'var(--color-primary-light)', marginBottom: 'var(--space-2)'}}>Matemáticas</h2>
          <p style={{color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)'}}>Aprende números y operaciones básicas.</p>
          <button onClick={() => navigate('/play/test')} className="btn btn-primary" style={{width: '100%'}}>Jugar Gratis</button>
        </div>

        {/* Mundo Palabras */}
        <div className="card" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', opacity: 0.8}}>
          <div style={{fontSize: '4rem', marginBottom: 'var(--space-4)'}}>📝</div>
          <h2 style={{color: 'var(--color-secondary)', marginBottom: 'var(--space-2)'}}>Palabras</h2>
          <p style={{color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)'}}>Descubre nuevas palabras y letras.</p>
          <button className="btn btn-secondary" style={{width: '100%'}}>Desbloquear (Premium)</button>
        </div>

      </div>
    </div>
  );
};
const GamePlay = () => {
  const [game, setGame] = React.useState<Phaser.Game | null>(null);

  // Hardcoded level data for testing
  const mockLevelData = {
    title: "Prueba Memotest",
    timeLimit: 60,
    gridSize: { cols: 4, rows: 3 }
  };

  const handleGameReady = (g: Phaser.Game) => {
    setGame(g);
    // Emulate starting a level shortly after game is ready
    setTimeout(() => {
      import('./game/EventBus').then(({ EventBus, GameEvents }) => {
        EventBus.emit(GameEvents.START_LEVEL, mockLevelData);
      });
    }, 1000);
  };

  return (
    <div className="container flex flex-col items-center justify-center" style={{paddingTop: 'var(--header-height)', height: '100vh'}}>
      <h1 style={{marginBottom: 'var(--space-4)'}}>Mundo Matemáticas</h1>
      
      <div style={{width: '800px', height: '600px', position: 'relative'}}>
        {/* Placeholder UI for HUD (React over Phaser) */}
        <div style={{position: 'absolute', top: 10, left: 20, zIndex: 10, color: '#fff', fontSize: '24px', fontFamily: 'Outfit', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
          Estrellas: ⭐⭐⭐
        </div>
        
        {/* We need to lazy load PhaserGame to avoid SSR/window issues if we ever use Next.js, but Vite is fine */}
        <React.Suspense fallback={<div>Cargando motor del juego...</div>}>
          <GameLoader onGameReady={handleGameReady} />
        </React.Suspense>
      </div>
    </div>
  );
};

// Lazy load to ensure Phaser doesn't block main bundle
const GameLoader = React.lazy(() => import('./game/PhaserGame').then(m => ({ default: m.PhaserGame })));

const NotFound = () => <div className="container" style={{paddingTop: 'var(--header-height)'}}><h1>404</h1><p>Página no encontrada</p></div>;

function App() {
  const { user, signOut } = useAuth();

  return (
    <div className="app-container">
      <header className="flex items-center justify-between container" style={{height: 'var(--header-height)', borderBottom: '1px solid var(--color-border)'}}>
        <div className="logo" style={{fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--color-primary-light)'}}>
          Aventuras del Saber
        </div>
        <nav className="flex gap-4">
            {user ? (
              <>
                <a href="/dashboard" className="btn btn-ghost btn-sm">Panel</a>
                <button onClick={signOut} className="btn btn-secondary btn-sm" style={{backgroundColor: 'transparent', border: '1px solid var(--color-secondary)', color: 'var(--color-secondary)'}}>Cerrar Sesión</button>
              </>
            ) : (
              <>
                <a href="/login" className="btn btn-ghost btn-sm">Ingresar</a>
                <a href="/register" className="btn btn-primary btn-sm">Pruébalo Gratis</a>
              </>
            )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/play/:levelId" element={<GamePlay />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
