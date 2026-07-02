import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BrandLogo } from '../brand/BrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { useFamilyProfiles } from '../../hooks/useFamilyProfiles';
import { getAvatarSrc } from '../../lib/familyProfiles';

export const Header = () => {
  const { user, signOut } = useAuth();
  const [isFamilyMenuOpen, setIsFamilyMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    activeChild,
    children,
    familyPackEnabled,
    isLoading,
    setActiveChildId,
  } = useFamilyProfiles();
  const canSwitchFamily = familyPackEnabled && children.length > 1;
  const userAvatarUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.user_metadata?.avatarUrl ||
    null;
  const activeProfileLabel =
    activeChild?.name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    user?.email ||
    'Perfil';
  const activeProfileAvatar = activeChild
    ? getAvatarSrc(activeChild.avatarId)
    : userAvatarUrl ?? getAvatarSrc();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 680) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <BrandLogo />
        <div className="site-header__actions">
          <div className="site-header__family-shell">
            <button
              type="button"
              className="site-header__avatar"
              title={activeProfileLabel}
              aria-haspopup={canSwitchFamily ? 'menu' : undefined}
              aria-expanded={canSwitchFamily ? isFamilyMenuOpen : undefined}
              onClick={() => {
                if (!canSwitchFamily) return;
                setIsFamilyMenuOpen((value) => !value);
              }}
              disabled={isLoading}
            >
              <img
                src={activeProfileAvatar}
                alt={activeProfileLabel}
                className="site-header__avatar-image"
              />
              <span className="site-header__avatar-name">{activeProfileLabel}</span>
            </button>

            {canSwitchFamily && isFamilyMenuOpen && (
              <div className="site-header__family-menu" role="menu" aria-label="Cambiar familiar">
                {children.map((child) => (
                  <button
                    key={child.id}
                    type="button"
                    className="site-header__family-option"
                    onClick={() => {
                      setActiveChildId(child.id);
                      setIsFamilyMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    <img
                      src={getAvatarSrc(child.avatarId)}
                      alt={child.name}
                      className="site-header__family-option-image"
                    />
                    <span>{child.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="site-header__menu-button"
            aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <nav className="site-nav site-nav--desktop" aria-label="Navegacion principal">
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

        {isMobileMenuOpen && (
          <div className="site-header__mobile-menu" role="menu" aria-label="Navegacion movil">
            {user ? (
              <>
                <NavLink to="/dashboard" className="btn btn-ghost btn-sm" onClick={closeMobileMenu}>
                  Panel
                </NavLink>
                <NavLink to="/account" className="btn btn-ghost btn-sm" onClick={closeMobileMenu}>
                  Cuenta
                </NavLink>
                <NavLink to="/subscribe" className="btn btn-ghost btn-sm" onClick={closeMobileMenu}>
                  Planes
                </NavLink>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    void signOut();
                  }}
                  className="btn btn-outline btn-sm"
                >
                  Salir
                </button>
              </>
            ) : (
              <>
                <NavLink to="/subscribe" className="btn btn-ghost btn-sm" onClick={closeMobileMenu}>
                  Planes
                </NavLink>
                <NavLink to="/login" className="btn btn-ghost btn-sm" onClick={closeMobileMenu}>
                  Ingresar
                </NavLink>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMobileMenu}>
                  Probar gratis
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
