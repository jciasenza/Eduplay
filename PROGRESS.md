# Documentación de progreso de EduPlay

Este documento se usa para registrar los avances del proyecto, los cambios importantes y el contexto de desarrollo. Se actualizará cada vez que se realicen mejoras significativas.

## Fecha inicial
- 25 de junio de 2026

## Objetivo
Registrar el progreso de la app y mantener un historial claro de decisiones, refactorizaciones y tareas completadas.

## Estado actual
- Monorepo con `apps/web` (frontend), `apps/api` (backend) y `packages/shared`.
- Frontend en React + Vite con rutas, páginas y primeros juegos construidos.
- Backend en NestJS con auth basado en Supabase/JWT.
- Se adoptó la estrategia de separar por módulos: auth, mundos, juegos, usuarios y pagos.

## Avances recientes
- Se mejoró el `WorldLanding` y `GameLobby` para aplicar paletas de color suaves y efectos de fondo.
- Se cambió el botón de juego directo para navegar al primer nivel sin pasar por selector de niveles.
- Se reforzó la estructura de páginas por mundo y se adaptó el estilo para que los mundos tengan acentos únicos.
- Se validó que el build del frontend compila correctamente después de los cambios de estilo.
- Se definió la necesidad de suscripciones mensuales/anuales y un panel admin en fase 1.

## Tareas clave pendientes
- Completar `GamesModule` en `apps/api` con niveles, progreso y sesiones.
- Implementar `UsersModule` con perfiles y datos de suscripción.
- Crear `PaymentsModule` con Mercado Pago (LATAM), checkout y webhooks.
- Refactorizar frontend para consumir API y centralizar la lógica de mundos/juegos.
- Agregar admin panel en fase 1 para gestionar usuarios, suscripciones y contenidos.

## Proximos pasos
1. Definir endpoints backend mínimos para `worlds`, `games`, `levels`, `sessions` y `checkout`.
2. Actualizar `task.md` con la priorización exacta de MVP.
3. Implementar el primer flujo de suscripción `monthly` / `annual`.
4. Escribir documentación de API y de uso interno del monorepo.

## Nota
Este archivo se debe mantener actualizado con cada avance significativo y con las decisiones de arquitectura.
### 25/6/2026, 19:51:13

- Inicial: habilitado append a PROGRESS.md y script npm update:progress

### 25/6/2026, 21:03:21

- Continuado flujo de suscripciones: checkout devuelve URL, API con prefijo /api y rawBody para webhooks, estilos de planes/estado y shared types compatibles con TS6.

### 25/6/2026, 21:32:35

- Agregados planes de suscripcion al front: link en header, seccion de pricing en landing, CTA desde dashboard, pagina /subscribe con IDs por env y estado de configuracion de pagos.

### 25/6/2026, 21:44:34

- Corregida pantalla vacia de /subscribe activando reveal; agregado panel /account para administrar perfiles familiares y acceso a facturacion cuando exista customerId.

### 25/6/2026, 21:57:32

- Agregadas paginas /terms, /privacy y /contact; footer actualizado a rutas reales y creado formulario de contacto con estilos responsive.

### 25/6/2026, 22:03:00

- Agregada pagina /about con informacion del producto y version; footer actualizado con enlace Acerca de y version visible.

### 25/6/2026, 22:08:35

- Actualizado formulario de contacto para usar curejuan@hotmail.com como canal temporal de soporte mediante mailto con asunto y cuerpo prearmados.

### 25/6/2026, 22:16:45

- Agregado endpoint backend POST /api/contact para envio directo de consultas con Resend hacia curejuan@hotmail.com; formulario de contacto actualizado para enviar via API.

### 25/6/2026, 22:26:49

- Implementados pasos 1-3: PrismaService, UsersModule con perfiles familiares, GamesModule con mundos/niveles/progreso/sesiones, y frontend conectado a /api/games/worlds y /api/users/me/children con fallback local.

### 25/6/2026, 22:36:27

- Corregido 401 de UsersModule validando Bearer token con Supabase auth.getUser; seed actualizado y ejecutado para 5 mundos/niveles en Supabase; frontend deja de mezclar mundos hardcodeados y consume solo /api/games/worlds.

### 25/6/2026, 22:41:28

- Corregida pantalla vacia al entrar a mundos reejecutando reveal tras carga de API y agregando estados de carga; UsersService ya no crea subscription al crear usuario para evitar 500 en perfiles.

### 25/6/2026, 22:44:59

- Corregido loop del primer juego: GamePlay reinyecta el nivel en cada GAME_READY, MainMenu deja de duplicar listeners START_LEVEL y MemoGame resetea estado al reiniciar.

### 25/6/2026, 22:52:03

- Mejorado flujo del juego: al ganar se puede avanzar al siguiente nivel o salir, al perder por tiempo se puede reintentar o salir; progreso se guarda por perfil activo y matematicas ahora tiene niveles math-02/math-03 con mas cartas.

### 25/6/2026, 22:59:40

- Alineados slugs de niveles de Matematicas en Supabase: activos solo math-01/math-02/math-03; GameOver refuerza clicks en botones y MemoGame usa labels de dataJson.cards para mostrar numeros/sumas reales.

### 25/6/2026, 23:10:03

- Corregidos niveles matematicos a numeros puros: math-01 1-6 con 12 cartas, math-02 7-12 con 12 cartas, math-03 13-21 con 18 cartas; panel React de resultado controla siguiente/reintentar/salir.

### 25/6/2026, 23:25:21

- Ajustado juego de memoria de matemáticas: niveles activos en Supabase con 6/12/18 cartas totales, títulos por nivel, avance entre niveles reinicia MemoGame y se eliminan botones Phaser viejos de GameOver para usar solo el modal React.

### 25/6/2026, 23:32:04

- Corregida home para mostrar mundos con fallback local y reveal dependiente de la carga; estrellas acumuladas por mejor resultado de cada nivel en localStorage y backend conserva mejor cantidad de estrellas/tiempo; getOrCreateUser tolera usuarios existentes por email para reducir 500 en /users/me.

### 29/6/2026, 20:18:00

- Pivote estratégico de monetización: Se reemplaza el flujo anterior de pagos por Mercado Pago, adaptando el módulo de Payments futuro.

### 29/6/2026, 21:20:00

- Arquitectura de pagos (Backend): Actualizado el schema de Prisma con el enum `PaymentProvider` y campos independientes para MP y LS. Creado el servicio unificado `PaymentsService` y el controlador `PaymentsController` para generar URLs de checkout y procesar webhooks de ambos proveedores con manejo de idempotencia.
- Arquitectura de pagos (Frontend): Actualizada la página `/subscribe` para usar Mercado Pago y remover selects manuales. Modificado el botón `CheckoutButton` para enviar el request al endpoint correspondiente.
- Limpieza: Eliminado el paquete de pagos anterior del backend, borrado el archivo de configuración, y depuradas referencias textuales a pagos viejos en `Account.tsx`, `Terms.tsx`, `Privacy.tsx` y `About.tsx`.

### 29/6/2026, 21:48:00

- Ajustada la cuenta familiar para que el acceso a usuarios extra dependa del pack familiar real y no de `localStorage`; la API ahora expone `familyPackEnabled` y bloquea altas adicionales si la suscripción activa no corresponde al plan familiar.
- Actualizada la pantalla `/subscribe` para incluir el pack familiar con sus IDs externos por entorno en Mercado Pago, dejando visible el estado de configuración faltante cuando todavía no está conectado.

### 30/6/2026, 20:15:00

- Corregido el checkout de Mercado Pago quitando `auto_return` para evitar el error `invalid_auto_return` y manteniendo `back_urls.success` en el redirect local.
- Eliminado el flujo de Lemon Squeezy del backend y limpiadas las referencias viejas a Stripe/Lemon en el repositorio activo.
- Renombrado el proyecto raíz y la documentación operativa a EduPlay.

### 30/6/2026, 20:20:00

- Corregido el `500` de `mp/subscribe` usando el `users.id` interno al crear la suscripción, evitando la violación de la foreign key `subscriptions_user_id_fkey`.
- `PaymentsModule` ahora reutiliza `UsersService` para asegurar que la cuenta local exista antes de registrar el checkout de Mercado Pago.

### 29/6/2026, 22:05:00

- Endurecida la cuenta para que los perfiles se sigan cargando aunque `/api/users/me` falle, evitando que un error puntual bloquee todo el panel.
- Corregido el guardado de perfiles para no bloquear la edición del perfil base en plan gratis; ahora la restricción queda del lado del backend cuando se intenta crear más perfiles de los permitidos.

### 29/6/2026, 22:18:00

- Ajustado `getOrCreateUser` para usar búsquedas tolerantes con `findFirst` en lugar de `findUnique` al resolver usuarios por `supabaseId` o `email`, reduciendo errores 500 en cuentas con datos históricos o registros duplicados.

### 29/6/2026, 22:40:00

- Mejorado el guardado de perfiles para mostrar el error real devuelto por el backend y usar identificadores locales explícitos para los borradores (`local-*`) antes de persistirlos.
- Agregado selector de perfil activo en el header, compartiendo el `active child` mediante `localStorage` para que se vea quién está jugando y se pueda cambiar cuando haya más de un familiar.
- Sumado logging en `UsersService` para registrar fallos de creación/actualización de usuarios y perfiles familiares con más detalle.

### 29/6/2026, 22:52:00

- Ajustado el selector del header para mantener siempre visible el perfil activo cuando ya hay varios familiares, evitando estados vacíos durante la carga.

### 29/6/2026, 23:05:00

- Añadida recuperación tolerante en `UsersService` para que `/api/users/me` no se rompa si la actualización/creación choca con datos históricos; ahora intenta devolver el usuario ya existente en lugar de caer directo en 500.
- Cambiado el header para mostrar el avatar real del perfil activo a la derecha, después del botón `Salir`, usando la imagen correspondiente al `avatarId`.

### 30/6/2026, 00:02:00

- Corregido `getOrCreateUser` para que `/api/users/me` deje de escribir en cada request cuando no hay cambios, reduciendo el riesgo de 500 durante la carga del panel.
- Rehecho el header para que el avatar sea el botón principal de cambio de familiar, con menú de selección cuando existen varios perfiles y sin el texto `perfil activo / perfil único`.

### 30/6/2026, 00:24:00

- Sincronizado el estado de perfiles familiares entre `Account` y `Header` mediante storage compartido y evento custom, para que el avatar/nombre del perfil activo se refleje al guardar cambios.
- Eliminado el fallback a perfiles viejos en memoria para que el header siempre derive del listado real de hijos cuando ya existe data del backend.
- Reforzada la resolución del usuario en `UsersService` para reusar o enlazar el `supabaseId` cuando llega por email, reduciendo inconsistencias al leer `/api/users/me` y `/api/users/me/children`.
- Conectado `Account` al mismo evento de sincronización para que el perfil activo se mantenga alineado con el header al cambiar de familiar o guardar ediciones.

### 30/6/2026, 01:05:00

- Pausado el flujo alternativo de suscripciones en el frontend para dejar Mercado Pago como único proveedor visible y operativo en `Subscribe`.
- Simplificado `CheckoutButton` para que siempre cree la suscripción por Mercado Pago y se retiren los selectores/regiones que alternaban entre proveedores.
- Actualizados textos legales y de producto para que la plataforma mencione solo Mercado Pago en la parte de pagos.

### 30/6/2026, 01:32:00

- Restaurado el precio visible en las cards de planes con formato monetario para que no quede solo el texto de Mercado Pago.
- Endurecida la creación de suscripciones en `PaymentsService` para aceptar `init_point` o `sandbox_init_point`, agregar `external_reference` y devolver un error más claro cuando Mercado Pago responde mal.

### 30/6/2026, 01:45:00

- Agregada guía visible en `/subscribe` para indicar qué IDs de Mercado Pago faltan por configurar en `.env`.
- Documentado en `.env` que los IDs de planes deben cargarse tanto para frontend (`VITE_MP_PLAN_*`) como para backend (`MP_PLAN_FAMILY_ID`) para habilitar el pack familiar.

### 30/6/2026, 02:10:00

- Añadido fallback en `PaymentsService` para que el checkout de Mercado Pago pueda crearse aunque el `preapprovalPlanId` todavía sea un placeholder.
- El frontend ahora envía el tipo de plan junto con el ID, permitiendo que el backend genere la suscripción directa en pruebas si el plan todavía no está creado en el panel.

### 30/6/2026, 02:30:00

- Corregido el paquete `@aventuras/shared` para que compile a `dist` y pueda ser consumido en runtime por el backend sin romper `localhost:3001`.
- `CheckoutButton` ahora muestra el error real devuelto por el backend/MP, en vez de ocultarlo detrás de un mensaje genérico.
- Añadido `predev` en `apps/api` y `apps/web` para compilar `shared` antes de arrancar en desarrollo.

### 30/6/2026, 02:55:00

- Simplificado el flujo de Mercado Pago para redirigir directamente a `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=...` usando el `preapproval_plan_id` configurado.
- Ajustada la pantalla de planes para considerar inválidos los placeholders tipo `your-mp-plan-*` y bloquear el botón hasta que se cargue un ID real.
- El backend ya no depende del access token de Mercado Pago para el redirect del checkout, porque la URL directa es suficiente para la prueba de pago.

### 30/6/2026, 03:25:00

- Migrado Mercado Pago a `checkout/preferences` con `items`, `back_urls`, `auto_return` y `external_reference`, eliminando la dependencia de `PLAN_ID` para el checkout.
- Simplificado `Subscribe` y `CheckoutButton` para que creen una preference nueva por cada compra sin requerir IDs de planes en `.env`.
- Ajustada la lógica de pack familiar para que el backend pueda reconocer el plan de familia a partir del tipo de compra recibido, en lugar de depender solo de IDs de Mercado Pago.
- Agregado un endpoint de sincronización manual de pago y conectado `SubscriptionSuccess` para confirmar el pago aprobado desde el frontend cuando el webhook no alcance a volver desde Mercado Pago.

### 30/6/2026, 03:55:00

- Instalada la dependencia `mercadopago` y creada `MercadoPagoProvider` para generar Checkout Pro Preferences con el SDK oficial.
- Reemplazado el create manual por `fetch` dentro del backend de pagos para usar `Preference.create(...)` con `items`, `back_urls`, `auto_return`, `external_reference` y `metadata`.

### 30/6/2026, 19:35:00

- Corregido el guard de Supabase en Node 20 agregando `ws` como transporte de Realtime, eliminando el `500` en `/api/users/me` y en los endpoints autenticados.
- Ajustado Vite para escuchar en `0.0.0.0` e ignorar `packages/shared/dist`, evitando los errores de `EPERM` y `ENOSPC` al correr `npm run dev`.
- Confirmado que `npm run dev` vuelve a levantar `@aventuras/web` y `@aventuras/api` correctamente con el stack actual.
- Agregado `@types/ws` y un manejo de error más claro en el provider de Mercado Pago para no ocultar fallos de preference detrás de un 500 genérico.

### 30/6/2026, 19:50:00

- Ajustado el checkout de Mercado Pago a moneda `ARS` para evitar validaciones incompatibles con la cuenta de pruebas local.
- El provider de Mercado Pago ahora expone el detalle real del error devuelto por la API en vez de devolver siempre un `400` genérico.
- `Subscribe` toma la moneda de `VITE_MP_CURRENCY_ID` para mantener consistentes el precio visual y el checkout.
