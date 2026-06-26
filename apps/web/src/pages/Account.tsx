import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FAMILY_CHILDREN_LIMIT } from '@aventuras/shared';
import { useAuth } from '../hooks/useAuth';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ChildProfileDraft {
  id: string;
  name: string;
  age: number;
  avatarId: string;
}

const defaultProfiles: ChildProfileDraft[] = [
  {
    id: 'child-1',
    name: 'Primer jugador',
    age: 7,
    avatarId: 'numi',
  },
];

export const Account = () => {
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [profiles, setProfiles] = useState<ChildProfileDraft[]>(defaultProfiles);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [isSavingProfiles, setIsSavingProfiles] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000';
  const accessToken = session?.access_token;
  const subscriptionStatus =
    window.localStorage.getItem('eduplay-subscription-status') === 'active'
      ? 'Activa'
      : 'Gratis';
  const displayName =
    user?.user_metadata?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.display_name ||
    user?.email ||
    'familia EduPlay';
  const canAddProfile = profiles.length < FAMILY_CHILDREN_LIMIT;
  const planLabel = subscriptionStatus === 'Activa' ? 'Premium familiar' : 'Plan gratis';
  const customerId = useMemo(
    () => import.meta.env.VITE_STRIPE_CUSTOMER_ID || window.localStorage.getItem('eduplay-stripe-customer-id') || '',
    [],
  );

  useScrollReveal();

  useEffect(() => {
    if (!accessToken) return;

    const loadAccount = async () => {
      try {
        await fetch(`${apiBaseUrl}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const response = await fetch(`${apiBaseUrl}/api/users/me/children`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('No se pudieron cargar los perfiles.');
        }

        const children = (await response.json()) as ChildProfileDraft[];
        if (children.length) {
          setProfiles(children);
        }
      } catch {
        setProfileMessage('Usando perfiles locales hasta conectar la sesion con la API.');
      }
    };

    void loadAccount();
  }, [accessToken, apiBaseUrl]);

  const updateProfile = (
    id: string,
    field: keyof Omit<ChildProfileDraft, 'id'>,
    value: string,
  ) => {
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
        id: `child-${Date.now()}`,
        name: `Jugador ${current.length + 1}`,
        age: 6,
        avatarId: 'pixel',
      },
    ]);
  };

  const removeProfile = (id: string) => {
    setProfiles((current) => current.filter((profile) => profile.id !== id));
  };

  const saveProfile = async (profile: ChildProfileDraft) => {
    if (!accessToken) {
      setProfileMessage('Inicia sesion para guardar perfiles en Supabase.');
      return;
    }

    try {
      setIsSavingProfiles(true);
      setProfileMessage(null);
      const isLocalProfile = profile.id.startsWith('child-');
      const response = await fetch(
        isLocalProfile
          ? `${apiBaseUrl}/api/users/me/children`
          : `${apiBaseUrl}/api/users/me/children/${profile.id}`,
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
        throw new Error('No se pudo guardar el perfil.');
      }

      const savedProfile = (await response.json()) as ChildProfileDraft;
      setProfiles((current) =>
        current.map((item) => (item.id === profile.id ? savedProfile : item)),
      );
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

    if (!accessToken || id.startsWith('child-')) {
      removeProfile(id);
      return;
    }

    try {
      setIsSavingProfiles(true);
      const response = await fetch(`${apiBaseUrl}/api/users/me/children/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo quitar el perfil.');
      }

      removeProfile(id);
      setProfileMessage('Perfil eliminado.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo quitar el perfil.';
      setProfileMessage(message);
    } finally {
      setIsSavingProfiles(false);
    }
  };

  const openBillingPortal = async () => {
    try {
      setIsOpeningPortal(true);
      setPortalError(null);

      if (!customerId) {
        throw new Error('Falta asociar el Stripe Customer ID del usuario.');
      }

      const response = await fetch(`${apiBaseUrl}/api/payments/create-portal-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: `${window.location.origin}/account`,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo abrir el portal de facturacion.');
      }

      const { portalUrl } = await response.json();
      if (!portalUrl) {
        throw new Error('El backend no devolvio una URL del portal.');
      }

      window.location.assign(portalUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ocurrio un error.';
      setPortalError(message);
    } finally {
      setIsOpeningPortal(false);
    }
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
              Desde este panel el usuario deberia administrar pagos, cambiar metodo de pago o
              cancelar la suscripcion usando el portal seguro de Stripe.
            </p>
            <div className="account-actions">
              <button
                className="btn btn-primary"
                onClick={openBillingPortal}
                disabled={isOpeningPortal || !customerId}
              >
                {isOpeningPortal ? 'Abriendo...' : 'Administrar facturacion'}
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/subscribe')}>
                Ver planes
              </button>
            </div>
            {!customerId && (
              <p className="account-note">
                Para habilitar bajas reales falta guardar el Stripe Customer ID del usuario tras el
                webhook de checkout.
              </p>
            )}
            {portalError && <p className="alert alert-error">{portalError}</p>}
          </article>

          <article className="account-panel reveal fade-up" data-reveal>
            <div className="account-panel__header">
              <div>
                <span className="eyebrow">Perfiles</span>
                <h2>Usuarios de juego</h2>
              </div>
              <button className="btn btn-outline btn-sm" onClick={addProfile} disabled={!canAddProfile}>
                Agregar
              </button>
            </div>

            <div className="profile-list">
              {profileMessage && <p className="account-note">{profileMessage}</p>}
              {profiles.map((profile) => (
                <div key={profile.id} className="profile-editor">
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
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
