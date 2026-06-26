# Estructura de Mundos y Juegos

Esta documentación explica cómo está organizada la estructura de mundos y juegos en el proyecto EduPlay.

## Estructura General

```
apps/web/src/worlds/
├── math/                          # Mundo de Matemáticas
│   ├── index.ts                  # Definición del mundo
│   └── games/
│       └── memoritest/           # Juego: Memotest Numérico
│           ├── index.ts          # Definición del juego
│           └── levels.ts         # Niveles del juego
│
├── words/                         # Mundo de Palabras
│   ├── index.ts                  # Definición del mundo
│   └── games/
│       └── lectura-rapida/       # Juego: Lectura Rápida
│           ├── index.ts          # Definición del juego
│           └── levels.ts         # Niveles del juego
│
├── natural-science/               # Mundo de Ciencias Naturales
│   ├── index.ts                  # Definición del mundo
│   └── games/
│       └── explora-y-descubre/   # Juego: Explora y Descubre
│           ├── index.ts          # Definición del juego
│           └── levels.ts         # Niveles del juego
│
├── history/                       # Mundo de Historia
│   ├── index.ts                  # Definición del mundo
│   └── games/
│       └── tiempo-magico/        # Juego: Tiempo Mágico
│           ├── index.ts          # Definición del juego
│           └── levels.ts         # Niveles del juego
│
└── logic/                         # Mundo de Lógica
    ├── index.ts                  # Definición del mundo
    └── games/
        └── reto-mental/          # Juego: Reto Mental
            ├── index.ts          # Definición del juego
            └── levels.ts         # Niveles del juego
```

## Componentes

### 1. Mundo (`worlds/[worldId]/index.ts`)

Cada mundo es un módulo que exporta una configuración `LearningWorld`:

```typescript
// apps/web/src/worlds/math/index.ts
import type { LearningWorld } from '../../data/worlds';
import { memoritestGame } from './games/memoritest';

export const mathWorld: LearningWorld = {
  id: 'math',
  title: 'Matematicas',
  description: 'Memotest de numeros, sumas y resultados.',
  icon: '#',
  accent: 'blue',
  badge: 'Gratis',
  actionLabel: 'Explorar mundo',
  progress: 58,
  characterName: 'Numi',
  characterRole: 'Guardian de numeros',
  characterImage: '/numi.png',
  games: [memoritestGame],
};
```

### 2. Juego (`worlds/[worldId]/games/[gameId]/index.ts`)

Cada juego es un módulo que exporta una configuración `GameConfig`:

```typescript
// apps/web/src/worlds/math/games/memoritest/index.ts
import type { GameConfig } from '../../../../data/worlds';
import { memoritestLevels } from './levels';

export const memoritestGame: GameConfig = {
  id: 'memorittest',
  title: 'Memotest numerico',
  description: 'Busca las parejas y practica numeros en un reto rapido.',
  icon: '🔢',
  route: 'memorittest',
  levels: memoritestLevels,
};
```

### 3. Niveles (`worlds/[worldId]/games/[gameId]/levels.ts`)

Cada juego define sus niveles:

```typescript
// apps/web/src/worlds/math/games/memoritest/levels.ts
import type { LevelConfig } from '../../../../data/worlds';

export const memoritestLevels: LevelConfig[] = [
  {
    id: 'memo-easy',
    title: 'Nivel 1: Parejas básicas',
    timeLimit: 120,
    gridSize: { cols: 3, rows: 3 },
  },
  {
    id: 'memo-medium',
    title: 'Nivel 2: Desafío intermedio',
    timeLimit: 100,
    gridSize: { cols: 4, rows: 4 },
  },
];
```

## Cómo Agregar un Nuevo Mundo

1. **Crear carpeta del mundo:**
   ```bash
   mkdir -p apps/web/src/worlds/[nuevo-mundo]/games
   ```

2. **Crear `index.ts` del mundo:**
   ```typescript
   // apps/web/src/worlds/[nuevo-mundo]/index.ts
   import type { LearningWorld } from '../../data/worlds';
   import { miJuegoGame } from './games/mi-juego';
   
   export const miMundo: LearningWorld = {
     id: '[nuevo-mundo]',
     title: 'Mi Nuevo Mundo',
     description: 'Descripción del mundo',
     icon: '🌟',
     accent: 'green',
     badge: 'Nuevo',
     actionLabel: 'Ver mundo',
     progress: 0,
     characterName: 'Personaje',
     characterImage: '/personaje.png',
     games: [miJuegoGame],
   };
   ```

3. **Crear juego en `games/[juego]/index.ts`:**
   ```typescript
   // apps/web/src/worlds/[nuevo-mundo]/games/mi-juego/index.ts
   import type { GameConfig } from '../../../../data/worlds';
   import { miJuegoLevels } from './levels';
   
   export const miJuegoGame: GameConfig = {
     id: 'mi-juego',
     title: 'Mi Juego',
     description: 'Descripción del juego',
     icon: '🎮',
     route: 'mi-juego',
     levels: miJuegoLevels,
   };
   ```

4. **Crear niveles en `games/[juego]/levels.ts`:**
   ```typescript
   import type { LevelConfig } from '../../../../data/worlds';
   
   export const miJuegoLevels: LevelConfig[] = [
     { id: 'level-1', title: 'Nivel 1', timeLimit: 120, gridSize: { cols: 3, rows: 3 } },
   ];
   ```

5. **Importar en `src/data/worlds.ts`:**
   ```typescript
   import { miMundo } from '../worlds/[nuevo-mundo]';
   
   export const learningWorlds: LearningWorld[] = [
     // ... otros mundos
     miMundo,
   ];
   ```

## Cómo Agregar un Nuevo Juego a un Mundo Existente

1. **Crear carpeta del juego:**
   ```bash
   mkdir -p apps/web/src/worlds/[mundo]/games/[nuevo-juego]
   ```

2. **Crear `index.ts` y `levels.ts` (igual que arriba)**

3. **Agregar al mundo en `worlds/[mundo]/index.ts`:**
   ```typescript
   import { nuevoJuegoGame } from './games/nuevo-juego';
   
   export const miMundo: LearningWorld = {
     // ...
     games: [miJuegoGame, nuevoJuegoGame], // Agregar aquí
   };
   ```

## Tipos de Datos

### LearningWorld
```typescript
interface LearningWorld {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: 'blue' | 'green' | 'orange' | 'pink' | 'purple' | 'yellow';
  badge: string;
  actionLabel: string;
  locked?: boolean;
  progress: number;
  characterName: string;
  characterRole: string;
  characterImage: string;
  games: GameConfig[];
}
```

### GameConfig
```typescript
interface GameConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  levels: LevelConfig[];
  locked?: boolean;
  status?: 'available' | 'premium' | 'coming-soon';
}
```

### LevelConfig
```typescript
interface LevelConfig {
  id: string;
  title: string;
  timeLimit: number;
  gridSize: { cols: number; rows: number };
}
```

## Búsqueda Rápida

### Encontrar un mundo
Todos los mundos están en `apps/web/src/worlds/[mundo-id]/index.ts`

### Encontrar un juego
Todos los juegos están en `apps/web/src/worlds/[mundo-id]/games/[juego-id]/index.ts`

### Encontrar los niveles de un juego
Los niveles están en `apps/web/src/worlds/[mundo-id]/games/[juego-id]/levels.ts`

## Integración con Pagos

Para hacer un juego premium:

1. En el `index.ts` del juego, establece:
   ```typescript
   export const miJuegoGame: GameConfig = {
     // ...
     locked: true,
     status: 'premium',
   };
   ```

2. El frontend mostrará un botón "Premium" en lugar de "Jugar"

3. Los usuarios necesitarán una suscripción activa para desbloquear

---

**Referencia rápida de carpetas:**
- Mundos: `apps/web/src/worlds/`
- Juegos: `apps/web/src/worlds/[mundo]/games/`
- Tipos: `apps/web/src/data/worlds.ts`
- Datos centralizados: `apps/web/src/data/worlds.ts`
