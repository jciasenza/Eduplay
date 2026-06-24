# 🎮 Aventuras del Saber — Task Tracker

## FASE 1 — Foundation (Semana 1)

### Monorepo Setup
- [ ] Inicializar monorepo con npm workspaces + Turborepo
- [ ] Crear `packages/shared` con tipos TypeScript compartidos
- [ ] Configurar scripts de build comunes

### Frontend Web (`apps/web`)
- [x] Scaffold con Vite + React + TypeScript
- [x] Design system CSS (colores, tipografía, componentes)
- [x] React Router (rutas principales)
- [ ] Integrar Phaser.js (bridge pattern)
- [x] Componentes UI base (botones, cards, modales)
- [x] Páginas placeholder (Landing, Login, Register, Dashboard, GamePlay)

### Backend API (`apps/api`)
- [x] Scaffold NestJS + TypeScript
- [x] Configurar Prisma + schema completo
- [x] Seed de datos iniciales (mundos + niveles)
- [x] Módulo Auth (Supabase strategy)
- [ ] Módulo Game (levels, progress, sessions)
- [ ] Módulo Users (CRUD children profiles)
- [ ] Guards (auth, roles, subscription)

### Auth (Supabase)
- [ ] Setup proyecto Supabase (Pendiente de usuario)
- [x] Configurar email/password auth
- [x] Configurar Google OAuth
- [x] Integrar con frontend (login/register)
- [x] Integrar con backend (JWT verification)

---

## FASE 2 — Game Core (Semana 2)
- [/] Escenas Phaser: Boot → Preloader → MainMenu → MemoGame → GameOver
- [/] Integrar Phaser.js en React (bridge pattern)
- [ ] Mecánica Memotest (flip, match, timer, estrellas)
- [ ] LevelManager (data-driven desde API)
- [ ] Guardar progreso
- [ ] 10 niveles gratis (Mundo Matemáticas)
- [ ] 10 niveles premium (Mundo Palabras)
- [ ] Sistema de mundos y selección de nivel
- [ ] Sonidos y música

## FASE 3 — Monetización + Admin (Semana 3)
- [ ] Stripe integration (checkout, portal, webhooks)
- [ ] Subscription guard
- [ ] Panel admin: dashboard
- [ ] Panel admin: CRUD niveles
- [ ] Panel admin: usuarios
- [ ] Panel admin: suscripciones

## FASE 4 — Landing + Deploy (Semana 4)
- [ ] Landing page completa
- [ ] Responsive design
- [ ] Polish animaciones
- [ ] SEO
- [ ] Deploy Vercel + Railway
- [ ] Testing E2E
