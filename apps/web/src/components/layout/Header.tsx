import { Link, NavLink } from 'react-router-dom';
import { BrandLogo } from '../brand/BrandLogo';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <BrandLogo />
        <nav className="site-nav" aria-label="Navegacion principal">
          {user ? (
            <>
              <NavLink to="/dashboard" className="btn btn-ghost btn-sm">
                Panel
              </NavLink>
              <NavLink to="/account" className="btn btn-ghost btn-sm">
                Cuenta
              </NavLink>
              <NavLink to="/subscribe" className="btn btn-ghost btn-sm">
                Planes
              </NavLink>
              <button onClick={signOut} className="btn btn-outline btn-sm">
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink to="/subscribe" className="btn btn-ghost btn-sm">
                Planes
              </NavLink>
              <NavLink to="/login" className="btn btn-ghost btn-sm">
                Ingresar
              </NavLink>
              <Link to="/register" className="btn btn-primary btn-sm">
                Probar gratis
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
