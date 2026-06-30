# EduPlay

EduPlay es una plataforma SaaS educativa pensada para familias y chicos, con mundos temáticos, minijuegos cortos, perfiles infantiles y suscripciones premium para desbloquear más contenido.

La app está organizada como un monorepo con frontend, backend y código compartido.

## Qué incluye

- Mundos educativos con niveles y progreso.
- Perfiles familiares para que un adulto administre a varios chicos.
- Suscripciones premium para habilitar más funciones.
- Panel de cuenta para ver y editar datos del usuario y de los perfiles de juego.
- Integración con Supabase para autenticación y PostgreSQL para persistencia.
- Integración de pagos con Mercado Pago.

## Estructura del proyecto

- `apps/web`: frontend en React + Vite.
- `apps/api`: backend en NestJS.
- `packages/shared`: constantes, tipos y utilidades compartidas entre frontend y backend.

## Tecnologías principales

- React
- Vite
- NestJS
- Prisma
- Supabase
- Mercado Pago
- TypeScript

## Requisitos

- Node.js 20 o superior
- npm 10
- Variables de entorno configuradas en `.env`

## Cómo ejecutar en local

Instalá dependencias:

```bash
npm install
```

Levantá toda la app:

```bash
npm run dev
```

Eso arranca:

- Frontend en `http://localhost:5173`
- Backend en `http://localhost:3001`

## Scripts útiles

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run clean
```

## Variables de entorno

Algunas variables importantes que usa la app:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `MP_ACCESS_TOKEN`
- `VITE_MP_PUBLIC_KEY`
- `MP_CURRENCY_ID`
- `VITE_MP_CURRENCY_ID`

## Flujo de suscripción

Actualmente las suscripciones se gestionan con Mercado Pago:

1. El usuario elige un plan.
2. El frontend llama al backend para crear una preference.
3. Mercado Pago redirige al checkout.
4. Al confirmarse el pago, la app sincroniza el estado y activa la suscripción.

## Estado del proyecto

EduPlay está en desarrollo activo. El foco actual está en:

- terminar de pulir el flujo de pagos,
- mejorar la administración de perfiles familiares,
- y seguir ampliando los mundos y niveles educativos.

## Equipo

- Producto: EduPlay
- Organización: CureSoft

