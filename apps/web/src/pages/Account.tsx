import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FAMILY_CHILDREN_LIMIT } from '@aventuras/shared';
import { useAuth } from '../hooks/useAuth';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { getApiBaseUrl } from '../lib/api';
import type { FamilyChildProfile } from '../lib/familyProfiles';
import {
  FAMILY_PROFILES_CHANGE_EVENT,
  getAvatarSrc,
  readStoredActiveChildId,
  readStoredActiveChildProfile,
  readStoredChildren,
  syncFamilyProfiles,
} from '../lib/familyProfiles';

interface AccountSubscription {
  status: string;
  familyPackEnabled: boolean;
}

interface AccountApiResponse {
  id: string;
  email: string;
  subscription: AccountSubscription | null;
}

type ChildProfileDraft = FamilyChildProfile;

const defaultProfiles: FamilyChildProfile[] = [
  {
    id: 'local-primary',
    name: 'Primer jugador',
    age: 7,
    avatarId: 'numi',
  },
];

export const Account = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [account, setAccount] = useState<AccountApiResponse | null>(null);
  const [profiles, setProfiles] = useState<FamilyChildProfile[]>(() => {
    const storedChildren = readStoredChildren();
    return storedChildren.length > 0 ? storedChildren : defaultProfiles;
  });
  const [isOpeningPortal] = useState(false);
  const [isSavingProfiles, setIsSavingProfiles] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [activeChildId, setActiveChildId] = useState<string | null>(() => readStoredActiveChildId());
  const [activeChildProfile, setActiveChildProfile] = useState<FamilyChildProfile | null>(() =>
    readStoredActiveChildProfile(),
  );
  const accessToken = session?.access_token;
  const hasFamilyPack = Boolean(account?.subscription?.familyPackEnabled);
  const subscriptionStatus = hasFamilyPack ? 'Activa' : 'Gratis';
  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    user?.email ||
    'familia EduPlay';
  const canAddProfile = hasFamilyPack && profiles.length < FAMILY_CHILDREN_LIMIT;
  const planLabel = hasFamilyPack ? 'Premium familiar' : 'Plan gratis';

  useScrollReveal();

  useEffect(() => {
    const refreshActiveSelection = () => {
      setActiveChildId(readStoredActiveChildId());
      setActiveChildProfile(readStoredActiveChildProfile());
    };

    window.addEventListener(FAMILY_PROFILES_CHANGE_EVENT, refreshActiveSelection);
    return () => {
      window.removeEventListener(FAMILY_PROFILES_CHANGE_EVENT, refreshActiveSelection);
    };
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const loadAccount = async () => {
      let loadedChildren = false;

      try {
        const meResponse = await fetch(`${getApiBaseUrl()}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (meResponse.ok) {
          const accountData = (await meResponse.json()) as AccountApiResponse;
          setAccount(accountData);
        }
      } catch {
        // Si /me falla, seguimos intentando cargar los perfiles.
      }

      try {
        const childrenResponse = await fetch(`${getApiBaseUrl()}/api/users/me/children`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!childrenResponse.ok) {
          throw new Error('No se pudieron cargar los perfiles.');
        }

        const children = (await childrenResponse.json()) as ChildProfileDraft[];
        if (children.length) {
          setProfiles(children);
          const nextActiveChildId = readStoredActiveChildId() ?? children[0]?.id ?? null;
          const nextActiveChildProfile =
            children.find((child) => child.id === nextActiveChildId) ?? children[0] ?? null;
          syncFamilyProfiles({
            children,
            activeChildId: nextActiveChildId,
            activeChildProfile: nextActiveChildProfile,
          });
          setActiveChildId(nextActiveChildId);
          setActiveChildProfile(nextActiveChildProfile);
          loadedChildren = true;
        }
      } catch {
        // Si no hay perfiles en la API, mantenemos el perfil local por defecto.
      }

      if (!loadedChildren) {
        setProfileMessage('Usando perfiles locales hasta conectar la sesion con la API.');
      }
    };

    void loadAccount();
  }, [accessToken]);

  const updateProfile = (id: string, field: keyof Omit<FamilyChildProfile, 'id'>, value: string) => {
    setProfiles((current) =>
      current.map((profile) =>
        profile.id === id
          ? {
              ...profile,
              [field]: field === 'age' ? Number(value) : value,
            }
          : profile,
      ),
    );
  };

  const addProfile = () => {
    if (!canAddProfile) return;

    setProfiles((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        name: `Jugador ${current.length + 1}`,
        age: 6,
        avatarId: 'pixel',
      },
    ]);
  };

  const saveProfile = async (profile: ChildProfileDraft) => {
    if (!accessToken) {
      setProfileMessage('Inicia sesion para guardar perfiles en Supabase.');
      return;
    }

    try {
      setIsSavingProfiles(true);
      setProfileMessage(null);
      const isLocalProfile = profile.id.startsWith('local-');
      const response = await fetch(
        isLocalProfile
          ? `${getApiBaseUrl()}/api/users/me/children`
          : `${getApiBaseUrl()}/api/users/me/children/${profile.id}`,
        {
          method: isLocalProfile ? 'POST' : 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: profile.name,
            age: profile.age,
            avatarId: profile.avatarId,
          }),
        },
      );

      if (!response.ok) {
        const errorPayload = await response.text();
        try {
          const parsed = JSON.parse(errorPayload) as { message?: string | string[] };
          const message = Array.isArray(parsed.message)
            ? parsed.message.join(', ')
            : parsed.message;
          throw new Error(message || 'No se pudo guardar el perfil.');
        } catch {
          throw new Error(errorPayload || 'No se pudo guardar el perfil.');
        }
      }

      const savedProfile = (await response.json()) as FamilyChildProfile;
      const nextProfiles = profiles.map((item) => (item.id === profile.id ? savedProfile : item));
      setProfiles(nextProfiles);
      const nextActiveProfile =
        activeChildId === profile.id || activeChildProfile?.id === profile.id
          ? savedProfile
          : activeChildProfile;
      syncFamilyProfiles({
        children: nextProfiles,
        activeChildId: activeChildId === profile.id ? savedProfile.id : activeChildId,
        activeChildProfile: nextActiveProfile,
      });
      if (nextActiveProfile !== activeChildProfile) {
        setActiveChildProfile(nextActiveProfile ?? null);
      }
      setProfileMessage('Perfil guardado.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el perfil.';
      setProfileMessage(message);
    } finally {
      setIsSavingProfiles(false);
    }
  };

  const deleteProfile = async (id: string) => {
    if (profiles.length === 1) return;

    if (!accessToken || id.startsWith('local-')) {
      const nextProfiles = profiles.filter((profile) => profile.id !== id);
      setProfiles(nextProfiles);
      const nextActiveProfile =
        activeChildProfile?.id === id ? nextProfiles[0] ?? null : activeChildProfile;
      syncFamilyProfiles({
        children: nextProfiles,
        activeChildId: activeChildId === id ? nextProfiles[0]?.id ?? null : activeChildId,
        activeChildProfile: nextActiveProfile,
      });
      if (nextActiveProfile !== activeChildProfile) {
        setActiveChildProfile(nextActiveProfile ?? null);
      }
      return;
    }

    try {
      setIsSavingProfiles(true);
      const response = await fetch(`${getApiBaseUrl()}/api/users/me/children/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo quitar el perfil.');
      }

      const nextProfiles = profiles.filter((profile) => profile.id !== id);
      setProfiles(nextProfiles);
      const nextActiveProfile =
        activeChildProfile?.id === id ? nextProfiles[0] ?? null : activeChildProfile;
      syncFamilyProfiles({
        children: nextProfiles,
        activeChildId: activeChildId === id ? nextProfiles[0]?.id ?? null : activeChildId,
        activeChildProfile: nextActiveProfile,
      });
      if (nextActiveProfile !== activeChildProfile) {
        setActiveChildProfile(nextActiveProfile ?? null);
      }
      setProfileMessage('Perfil eliminado.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo quitar el perfil.';
      setProfileMessage(message);
    } finally {
      setIsSavingProfiles(false);
    }
  };

  const openBillingPortal = async () => {
    // Aquí implementaremos la lógica para el portal de facturación de Mercado Pago.
    setPortalError('El portal de facturación se implementará pronto con Mercado Pago.');
  };

  return (
    <section className="account-page">
      <div className="container account-page__inner">
        <div className="account-header reveal fade-up" data-reveal>
          <div>
            <span className="eyebrow">Cuenta familiar</span>
            <h1>Administra perfiles y suscripcion</h1>
            <p>{displayName}</p>
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/subscribe')}>
            Cambiar plan
          </button>
        </div>

        <div className="account-grid">
          <article className="account-panel reveal fade-up" data-reveal>
            <div className="account-panel__header">
              <div>
                <span className="eyebrow">Suscripcion</span>
                <h2>{planLabel}</h2>
              </div>
              <span className="subscription-pill">{subscriptionStatus}</span>
            </div>
            <p>
              Desde este panel podrás administrar tu suscripción local o internacional en el futuro.
            </p>
            <div className="account-actions">
              <button
                className="btn btn-primary"
                onClick={openBillingPortal}
                disabled={isOpeningPortal}
              >
                {isOpeningPortal ? 'Abriendo...' : 'Administrar facturacion'}
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/subscribe')}>
                Ver planes
              </button>
            </div>
            {portalError && <p className="alert alert-error">{portalError}</p>}
          </article>

          <article className="account-panel reveal fade-up" data-reveal>
            <div className="account-panel__header">
              <div>
                <span className="eyebrow">Perfiles</span>
                <h2>Usuarios de juego</h2>
              </div>
              {hasFamilyPack && (
                <button className="btn btn-outline btn-sm" onClick={addProfile} disabled={!canAddProfile}>
                  Agregar
                </button>
              )}
            </div>

            <div className="profile-list">
              {profileMessage && <p className="account-note">{profileMessage}</p>}
              {!hasFamilyPack && (
                <p className="account-note">
                  El plan gratuito permite un solo jugador. El pack familiar habilita hasta 4 usuarios de juego.
                </p>
              )}
              {profiles.map((profile) => {
                const isActiveProfile = activeChildId === profile.id;
                const worldProgress = profile.worldProgress ?? [];

                return (
                  <div
                    key={profile.id}
                    className={`profile-editor ${isActiveProfile ? 'profile-editor--active' : ''}`}
                  >
                    <div className="profile-editor__top">
                      <div className="profile-editor__identity">
                        <img
                          className="profile-editor__avatar"
                          src={getAvatarSrc(profile.avatarId)}
                          alt={profile.name}
                        />
                        <div>
                          <strong>{profile.name}</strong>
                          <p>
                            {profile.age} años
                            {isActiveProfile ? ' · Jugador activo' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="profile-editor__badge-row">
                        <span className="profile-editor__badge">⭐ {profile.totalStars ?? 0}</span>
                        <span className="profile-editor__badge">Puntos {profile.totalPoints ?? 0}</span>
                        <span className="profile-editor__badge">
                          Mundos {profile.worldProgress?.length ?? 0}
                        </span>
                      </div>
                    </div>

                    <div className="profile-editor__form">
                      <label>
                        Nombre
                        <input
                          value={profile.name}
                          onChange={(event) => updateProfile(profile.id, 'name', event.target.value)}
                        />
                      </label>
                      <label>
                        Edad
                        <input
                          min="3"
                          max="12"
                          type="number"
                          value={profile.age}
                          onChange={(event) => updateProfile(profile.id, 'age', event.target.value)}
                        />
                      </label>
                      <label>
                        Avatar
                        <select
                          value={profile.avatarId}
                          onChange={(event) => updateProfile(profile.id, 'avatarId', event.target.value)}
                        >
                          <option value="numi">Numi</option>
                          <option value="lira">Lira</option>
                          <option value="natu">Natu</option>
                          <option value="pixel">Pixel</option>
                        </select>
                      </label>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => deleteProfile(profile.id)}
                        disabled={profiles.length === 1}
                      >
                        Quitar
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => saveProfile(profile)}
                        disabled={isSavingProfiles}
                      >
                        Guardar
                      </button>
                    </div>

                    <div className="profile-progress">
                      <div className="profile-progress__summary">
                        <span>⭐ {profile.totalStars ?? 0} estrellas acumuladas</span>
                        <span>🏅 {profile.completedLevels ?? 0} niveles completados</span>
                        <span>🎯 {profile.totalPoints ?? 0} puntos</span>
                      </div>
                      {worldProgress.length > 0 ? (
                        <div className="profile-progress__worlds">
                          {worldProgress.map((world) => (
                            <div key={world.worldId} className="profile-progress__world">
                              <strong>{world.worldName}</strong>
                              <p>
                                {world.completedLevels} niveles · {world.stars} estrellas · {world.points} puntos
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="profile-progress__empty">
                          Todavía no hay progreso guardado en este jugador.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
