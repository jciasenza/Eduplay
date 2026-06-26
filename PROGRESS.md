# Documentación de progreso de Aventuras del Saber

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
- Crear `PaymentsModule` con Stripe (mensual/anual), checkout y webhooks.
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

- Continuado flujo de suscripciones: checkout de Stripe devuelve URL, API con prefijo /api y rawBody para webhooks, estilos de planes/estado y shared types compatibles con TS6.

### 25/6/2026, 21:32:35

- Agregados planes de suscripcion al front: link en header, seccion de pricing en landing, CTA desde dashboard, pagina /subscribe con Price IDs por env y estado de configuracion de Stripe.

### 25/6/2026, 21:44:34

- Corregida pantalla vacia de /subscribe activando reveal; agregado panel /account para administrar perfiles familiares y acceso al portal de facturacion/cancelacion de Stripe cuando exista customerId.

### 25/6/2026, 21:57:32

- Agregadas paginas /terms, /privacy y /contact; footer actualizado a rutas reales y creado formulario de contacto con estilos responsive.

### 25/6/2026, 22:03:00

- Agregada pagina /about con informacion del producto y version; footer actualizado con enlace Acerca de y version visible.

### 25/6/2026, 22:08:35

- Actualizado formulario de contacto para usar curejuan@hotmail.com como canal temporal de soporte mediante mailto con asunto y cuerpo prearmados.

### 25/6/2026, 22:16:45

- Agregado endpoint backend POST /api/contact para envio directo de consultas con Resend hacia curejuan@hotmail.com; formulario de contacto actualizado para enviar via API.

### 25/6/2026, 22:26:49

- Implementados pasos 1-3 sin tocar Stripe: PrismaService, UsersModule con perfiles familiares, GamesModule con mundos/niveles/progreso/sesiones, y frontend conectado a /api/games/worlds y /api/users/me/children con fallback local.

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

