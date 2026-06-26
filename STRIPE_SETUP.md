# Configuración de Stripe - Guía de Implementación

## 1. Crear cuenta en Stripe (si no tienes)

1. Ir a https://stripe.com
2. Crear cuenta o iniciar sesión
3. Ir al [Dashboard de Stripe](https://dashboard.stripe.com)

## 2. Obtener claves API

### Modo Test (Desarrollo)

1. En el Dashboard, ve a **Developers** → **API keys** en el menú lateral
2. Asegúrate de estar en modo "Test" (arriba a la izquierda)
3. Copia:
   - **Publishable key** (comienza con `pk_test_`) → `VITE_STRIPE_PUBLISHABLE_KEY` (frontend)
   - **Secret key** (comienza con `sk_test_`) → `STRIPE_SECRET_KEY` (backend)

### Webhook Secret

1. En **Developers** → **Webhooks**
2. Haz clic en "Add endpoint"
3. URL: `http://localhost:3000/api/payments/webhook` (o tu URL de producción)
4. Selecciona eventos:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copia el **Signing secret** → `STRIPE_WEBHOOK_SECRET`

## 3. Crear Productos y Precios en Stripe

1. En Dashboard → **Products** (o Billing → Products)
2. Haz clic en **Add product**
3. Crea productos para cada plan:

### Plan 1: Explorador (Mensual)
- **Name**: "Explorador Mensual"
- **Description**: "Acceso completo a todos los mundos"
- **Type**: Service
- **Pricing**: Recurring (Subscription)
  - **Price**: $4.99
  - **Billing period**: Monthly
- Copia el **Price ID** (comienza con `price_`) → actualiza `packages/shared/src/constants/plans.ts`

### Plan 2: Explorador Anual
- **Name**: "Explorador Anual"
- **Description**: "Acceso completo - Ahorrá 40%"
- **Pricing**: Recurring (Subscription)
  - **Price**: $35.99
  - **Billing period**: Yearly
- Copia el **Price ID**

### Plan 3: Familia
- **Name**: "Plan Familia"
- **Description**: "Hasta 4 perfiles - Dashboard para padres"
- **Pricing**: Recurring (Subscription)
  - **Price**: $6.99
  - **Billing period**: Monthly
- Copia el **Price ID**

## 4. Actualizar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Backend
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
CONTACT_TO_EMAIL=curejuan@hotmail.com
CONTACT_FROM_EMAIL="EduPlay <onboarding@resend.dev>"
RESEND_API_KEY=re_xxxxx

# Frontend (apps/web/.env.local o raíz)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_API_BASE_URL=http://localhost:3000
```

## 5. Actualizar Price IDs en planes

En `packages/shared/src/constants/plans.ts`:

```typescript
stripePriceId: 'price_1234567890abcdef' // Tu ID real de Stripe
```

## 6. Instalar Stripe CLI (para testing local)

```bash
# Descargar: https://stripe.com/docs/stripe-cli
# O con Homebrew (macOS/Linux):
brew install stripe/stripe-cli/stripe

# Autenticar:
stripe login

# Escuchar webhooks locales:
stripe listen --forward-to localhost:3000/api/payments/webhook

# Simular eventos:
stripe trigger checkout.session.completed
```

## 7. Testing

### Tarjetas de Prueba

- **Éxito**: `4242 4242 4242 4242`
- **Error**: `4000 0000 0000 0002`
- **Expiración**: Cualquier fecha futura
- **CVC**: Cualquier número de 3 dígitos

### Flujo de Testing

1. Inicia los servidores (backend + frontend)
2. Navega a `/subscribe`
3. Haz clic en "Suscribirse"
4. Usa una tarjeta de prueba (4242...)
5. Verifica en Stripe Dashboard que el evento se registró

## 8. Migración de Base de Datos (Prisma)

Para guardar información de suscripción en tu BD, actualiza `apps/api/prisma/schema.prisma`:

```prisma
model User {
  id String @id @default(cuid())
  email String @unique
  stripeCustomerId String? @unique
  stripeSubscriptionId String?
  subscriptionStatus String? // active, cancelled, past_due
  subscriptionStartDate DateTime?
  subscriptionEndDate DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("users")
}

model Subscription {
  id String @id @default(cuid())
  userId String
  stripeCustomerId String
  stripeSubscriptionId String @unique
  stripePriceId String
  status String // active, cancelled, past_due, trialing
  currentPeriodStart DateTime
  currentPeriodEnd DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@map("subscriptions")
}
```

Luego ejecuta:

```bash
cd apps/api
npx prisma migrate dev --name add_stripe_fields
```

## 9. Instalar Stripe SDK en Backend (si no está instalado)

```bash
cd apps/api
npm install stripe
npm install -D @types/stripe
```

## 10. Referencias

- [Stripe Docs - Checkout](https://stripe.com/docs/checkout)
- [Stripe Docs - Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Test Cardslist](https://stripe.com/docs/testing)

---

**Próximos pasos:**
1. Completar `payments.service.ts` con la lógica de DB (descomentar TODOs)
2. Implementar autenticación en endpoints de pagos
3. Agregar guards para verificar usuario autenticado
4. Implementar lógica de desbloqueo de mundos según suscripción
