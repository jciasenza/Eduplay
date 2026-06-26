import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

const defaultStarThresholds = {
  '3stars': { maxTime: 30, maxMoves: 12 },
  '2stars': { maxTime: 60, maxMoves: 20 },
  '1star': { maxTime: 120, maxMoves: 30 },
};

const worlds = [
  {
    name: 'Matemáticas',
    slug: 'matematicas',
    description: 'Aprende números y operaciones básicas',
    iconUrl: '🔢',
    isPremium: false,
    order: 1,
  },
  {
    name: 'Palabras',
    slug: 'palabras',
    description: 'Descubre nuevas palabras y letras',
    iconUrl: '📝',
    isPremium: true,
    order: 2,
  },
  {
    name: 'Ciencias Naturales',
    slug: 'ciencias-naturales',
    description: 'Plantas, cuerpo humano, planeta y descubrimientos.',
    iconUrl: '🧪',
    isPremium: true,
    order: 3,
  },
  {
    name: 'Historia',
    slug: 'historia',
    description: 'Viajes por epocas, culturas y grandes acontecimientos.',
    iconUrl: '⏳',
    isPremium: true,
    order: 4,
  },
  {
    name: 'Logica',
    slug: 'logica',
    description: 'Patrones, memoria, estrategia y pensamiento rapido.',
    iconUrl: '🧠',
    isPremium: true,
    order: 5,
  },
];

const levelTemplates = [
  {
    worldSlug: 'matematicas',
    title: 'Nivel 1: 6 cartas',
    slug: 'math-01',
    difficulty: Difficulty.EASY,
    category: 'math',
    order: 1,
    isPremium: false,
    dataJson: {
      gridSize: { cols: 3, rows: 2 },
      timeLimit: 60,
      pairs: 3,
      theme: 'numbers',
      cards: [
        { id: 'num1', image: '/assets/cards/1.png', label: '1' },
        { id: 'num2', image: '/assets/cards/2.png', label: '2' },
        { id: 'num3', image: '/assets/cards/3.png', label: '3' },
      ],
      background: '/assets/backgrounds/math.png',
      starThresholds: defaultStarThresholds,
    },
  },
  {
    worldSlug: 'matematicas',
    title: 'Nivel 2: 12 cartas',
    slug: 'math-02',
    difficulty: Difficulty.MEDIUM,
    category: 'math',
    order: 2,
    isPremium: false,
    dataJson: {
      gridSize: { cols: 4, rows: 3 },
      timeLimit: 75,
      pairs: 6,
      theme: 'numbers',
      cards: [
        { id: 'num1', image: '/assets/cards/1.png', label: '1' },
        { id: 'num2', image: '/assets/cards/2.png', label: '2' },
        { id: 'num3', image: '/assets/cards/3.png', label: '3' },
        { id: 'num4', image: '/assets/cards/4.png', label: '4' },
        { id: 'num5', image: '/assets/cards/5.png', label: '5' },
        { id: 'num6', image: '/assets/cards/6.png', label: '6' },
      ],
      background: '/assets/backgrounds/math.png',
      starThresholds: defaultStarThresholds,
    },
  },
  {
    worldSlug: 'matematicas',
    title: 'Nivel 3: 18 cartas',
    slug: 'math-03',
    difficulty: Difficulty.HARD,
    category: 'math',
    order: 3,
    isPremium: false,
    dataJson: {
      gridSize: { cols: 6, rows: 3 },
      timeLimit: 90,
      pairs: 9,
      theme: 'numbers',
      cards: [
        { id: 'num1', image: '/assets/cards/1.png', label: '1' },
        { id: 'num2', image: '/assets/cards/2.png', label: '2' },
        { id: 'num3', image: '/assets/cards/3.png', label: '3' },
        { id: 'num4', image: '/assets/cards/4.png', label: '4' },
        { id: 'num5', image: '/assets/cards/5.png', label: '5' },
        { id: 'num6', image: '/assets/cards/6.png', label: '6' },
        { id: 'num7', image: '/assets/cards/7.png', label: '7' },
        { id: 'num8', image: '/assets/cards/8.png', label: '8' },
        { id: 'num9', image: '/assets/cards/9.png', label: '9' },
      ],
      background: '/assets/backgrounds/math.png',
      starThresholds: defaultStarThresholds,
    },
  },
  {
    worldSlug: 'palabras',
    title: 'Nivel 1: Silabas basicas',
    slug: 'lectura-1',
    difficulty: Difficulty.EASY,
    category: 'words',
    order: 1,
    isPremium: true,
    dataJson: {
      gridSize: { cols: 3, rows: 3 },
      timeLimit: 120,
      pairs: 4,
      theme: 'words',
      cards: [
        { id: 'ma', image: '/assets/cards/ma.png', label: 'Ma' },
        { id: 'me', image: '/assets/cards/me.png', label: 'Me' },
        { id: 'pa', image: '/assets/cards/pa.png', label: 'Pa' },
        { id: 'pe', image: '/assets/cards/pe.png', label: 'Pe' },
      ],
      background: '/assets/backgrounds/words.png',
      starThresholds: defaultStarThresholds,
    },
  },
  {
    worldSlug: 'palabras',
    title: 'Nivel 2: Palabras simples',
    slug: 'lectura-2',
    difficulty: Difficulty.MEDIUM,
    category: 'words',
    order: 2,
    isPremium: true,
    dataJson: {
      gridSize: { cols: 4, rows: 3 },
      timeLimit: 100,
      pairs: 6,
      theme: 'words',
      cards: [
        { id: 'casa', image: '/assets/cards/casa.png', label: 'Casa' },
        { id: 'sol', image: '/assets/cards/sol.png', label: 'Sol' },
        { id: 'luna', image: '/assets/cards/luna.png', label: 'Luna' },
        { id: 'mesa', image: '/assets/cards/mesa.png', label: 'Mesa' },
        { id: 'pato', image: '/assets/cards/pato.png', label: 'Pato' },
        { id: 'flor', image: '/assets/cards/flor.png', label: 'Flor' },
      ],
      background: '/assets/backgrounds/words.png',
      starThresholds: defaultStarThresholds,
    },
  },
  {
    worldSlug: 'ciencias-naturales',
    title: 'Nivel 1: Plantas y flores',
    slug: 'ciencia-1',
    difficulty: Difficulty.EASY,
    category: 'science',
    order: 1,
    isPremium: true,
    dataJson: {
      gridSize: { cols: 3, rows: 3 },
      timeLimit: 120,
      pairs: 4,
      theme: 'plants',
      cards: [
        { id: 'flor', image: '/assets/cards/flor.png', label: 'Flor' },
        { id: 'hoja', image: '/assets/cards/hoja.png', label: 'Hoja' },
        { id: 'raiz', image: '/assets/cards/raiz.png', label: 'Raiz' },
        { id: 'semilla', image: '/assets/cards/semilla.png', label: 'Semilla' },
      ],
      background: '/assets/backgrounds/science.png',
      starThresholds: defaultStarThresholds,
    },
  },
  {
    worldSlug: 'ciencias-naturales',
    title: 'Nivel 2: Cuerpo humano',
    slug: 'ciencia-2',
    difficulty: Difficulty.MEDIUM,
    category: 'science',
    order: 2,
    isPremium: true,
    dataJson: {
      gridSize: { cols: 3, rows: 3 },
      timeLimit: 120,
      pairs: 4,
      theme: 'body',
      cards: [
        { id: 'mano', image: '/assets/cards/mano.png', label: 'Mano' },
        { id: 'ojo', image: '/assets/cards/ojo.png', label: 'Ojo' },
        { id: 'pie', image: '/assets/cards/pie.png', label: 'Pie' },
        { id: 'corazon', image: '/assets/cards/corazon.png', label: 'Corazon' },
      ],
      background: '/assets/backgrounds/science.png',
      starThresholds: defaultStarThresholds,
    },
  },
  {
    worldSlug: 'historia',
    title: 'Nivel 1: La antigüedad',
    slug: 'historia-1',
    difficulty: Difficulty.EASY,
    category: 'history',
    order: 1,
    isPremium: true,
    dataJson: {
      gridSize: { cols: 3, rows: 3 },
      timeLimit: 120,
      pairs: 4,
      theme: 'history',
      cards: [
        { id: 'piramide', image: '/assets/cards/piramide.png', label: 'Piramide' },
        { id: 'templo', image: '/assets/cards/templo.png', label: 'Templo' },
        { id: 'mapa', image: '/assets/cards/mapa.png', label: 'Mapa' },
        { id: 'rueda', image: '/assets/cards/rueda.png', label: 'Rueda' },
      ],
      background: '/assets/backgrounds/history.png',
      starThresholds: defaultStarThresholds,
    },
  },
  {
    worldSlug: 'historia',
    title: 'Nivel 2: La edad media',
    slug: 'historia-2',
    difficulty: Difficulty.MEDIUM,
    category: 'history',
    order: 2,
    isPremium: true,
    dataJson: {
      gridSize: { cols: 3, rows: 3 },
      timeLimit: 120,
      pairs: 4,
      theme: 'history',
      cards: [
        { id: 'castillo', image: '/assets/cards/castillo.png', label: 'Castillo' },
        { id: 'escudo', image: '/assets/cards/escudo.png', label: 'Escudo' },
        { id: 'corona', image: '/assets/cards/corona.png', label: 'Corona' },
        { id: 'libro', image: '/assets/cards/libro.png', label: 'Libro' },
      ],
      background: '/assets/backgrounds/history.png',
      starThresholds: defaultStarThresholds,
    },
  },
  {
    worldSlug: 'logica',
    title: 'Nivel 1: Patrones basicos',
    slug: 'logica-1',
    difficulty: Difficulty.EASY,
    category: 'logic',
    order: 1,
    isPremium: true,
    dataJson: {
      gridSize: { cols: 3, rows: 3 },
      timeLimit: 120,
      pairs: 4,
      theme: 'patterns',
      cards: [
        { id: 'rojo', image: '/assets/cards/rojo.png', label: 'Rojo' },
        { id: 'azul', image: '/assets/cards/azul.png', label: 'Azul' },
        { id: 'circulo', image: '/assets/cards/circulo.png', label: 'Circulo' },
        { id: 'cuadrado', image: '/assets/cards/cuadrado.png', label: 'Cuadrado' },
      ],
      background: '/assets/backgrounds/logic.png',
      starThresholds: defaultStarThresholds,
    },
  },
  {
    worldSlug: 'logica',
    title: 'Nivel 2: Estrategia avanzada',
    slug: 'logica-2',
    difficulty: Difficulty.MEDIUM,
    category: 'logic',
    order: 2,
    isPremium: true,
    dataJson: {
      gridSize: { cols: 4, rows: 4 },
      timeLimit: 120,
      pairs: 8,
      theme: 'strategy',
      cards: [
        { id: 'a1', image: '/assets/cards/a1.png', label: 'A1' },
        { id: 'a2', image: '/assets/cards/a2.png', label: 'A2' },
        { id: 'b1', image: '/assets/cards/b1.png', label: 'B1' },
        { id: 'b2', image: '/assets/cards/b2.png', label: 'B2' },
        { id: 'c1', image: '/assets/cards/c1.png', label: 'C1' },
        { id: 'c2', image: '/assets/cards/c2.png', label: 'C2' },
        { id: 'd1', image: '/assets/cards/d1.png', label: 'D1' },
        { id: 'd2', image: '/assets/cards/d2.png', label: 'D2' },
      ],
      background: '/assets/backgrounds/logic.png',
      starThresholds: defaultStarThresholds,
    },
  },
];

async function main() {
  console.log('Start seeding...');

  const worldIdsBySlug = new Map<string, string>();

  for (const world of worlds) {
    const savedWorld = await prisma.world.upsert({
      where: { slug: world.slug },
      update: {
        name: world.name,
        description: world.description,
        iconUrl: world.iconUrl,
        isPremium: world.isPremium,
        order: world.order,
        isActive: true,
      },
      create: world,
    });

    worldIdsBySlug.set(world.slug, savedWorld.id);
  }

  for (const level of levelTemplates) {
    const worldId = worldIdsBySlug.get(level.worldSlug);
    if (!worldId) {
      throw new Error(`Missing world for level ${level.slug}`);
    }

    await prisma.level.upsert({
      where: { slug: level.slug },
      update: {
        title: level.title,
        difficulty: level.difficulty,
        category: level.category,
        worldId,
        order: level.order,
        isPremium: level.isPremium,
        isActive: true,
        dataJson: level.dataJson,
      },
      create: {
        title: level.title,
        slug: level.slug,
        difficulty: level.difficulty,
        category: level.category,
        worldId,
        order: level.order,
        isPremium: level.isPremium,
        dataJson: level.dataJson,
      },
    });
  }

  for (const world of worlds) {
    const worldId = worldIdsBySlug.get(world.slug);
    if (!worldId) continue;

    const activeSlugs = levelTemplates
      .filter((level) => level.worldSlug === world.slug)
      .map((level) => level.slug);

    await prisma.level.updateMany({
      where: {
        worldId,
        slug: { notIn: activeSlugs },
      },
      data: {
        isActive: false,
      },
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
