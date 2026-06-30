import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BrandLogo } from '../brand/BrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { useFamilyProfiles } from '../../hooks/useFamilyProfiles';
import { getAvatarSrc } from '../../lib/familyProfiles';

export const Header = () => {
  const { user, signOut } = useAuth();
  const [isFamilyMenuOpen, setIsFamilyMenuOpen] = useState(false);
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
