import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Crear Mundos
  const mathWorld = await prisma.world.upsert({
    where: { slug: 'matematicas' },
    update: {},
    create: {
      name: 'Matemáticas',
      slug: 'matematicas',
      description: 'Aprende números y operaciones básicas',
      iconUrl: '🔢',
      isPremium: false,
      order: 1,
    },
  });

  const wordsWorld = await prisma.world.upsert({
    where: { slug: 'palabras' },
    update: {},
    create: {
      name: 'Palabras',
      slug: 'palabras',
      description: 'Descubre nuevas palabras y letras',
      iconUrl: '📝',
      isPremium: true,
      order: 2,
    },
  });

  // 2. Crear Niveles de Matemáticas (Gratis)
  const mathLevels = [
    {
      title: 'Números del 1 al 5',
      slug: 'numeros-1-5',
      difficulty: Difficulty.EASY,
      category: 'math',
      worldId: mathWorld.id,
      order: 1,
      isPremium: false,
      dataJson: {
        gridSize: { cols: 3, rows: 2 },
        timeLimit: 60,
        pairs: 3,
        theme: 'numbers',
        cards: [
          { id: 'num1', image: '/assets/cards/1.png', label: 'Uno' },
          { id: 'num2', image: '/assets/cards/2.png', label: 'Dos' },
          { id: 'num3', image: '/assets/cards/3.png', label: 'Tres' },
        ],
        background: '/assets/backgrounds/math.png',
        starThresholds: {
          '3stars': { maxTime: 20, maxMoves: 6 },
          '2stars': { maxTime: 40, maxMoves: 10 },
          '1star': { maxTime: 60, maxMoves: 20 },
        },
      },
    },
    {
      title: 'Números del 6 al 10',
      slug: 'numeros-6-10',
      difficulty: Difficulty.MEDIUM,
      category: 'math',
      worldId: mathWorld.id,
      order: 2,
      isPremium: false,
      dataJson: {
        gridSize: { cols: 4, rows: 3 },
        timeLimit: 90,
        pairs: 6,
        theme: 'numbers',
        cards: [
          { id: 'num6', image: '/assets/cards/6.png', label: 'Seis' },
          { id: 'num7', image: '/assets/cards/7.png', label: 'Siete' },
          { id: 'num8', image: '/assets/cards/8.png', label: 'Ocho' },
          { id: 'num9', image: '/assets/cards/9.png', label: 'Nueve' },
          { id: 'num10', image: '/assets/cards/10.png', label: 'Diez' },
          { id: 'num5', image: '/assets/cards/5.png', label: 'Cinco' }, // Filler for 6 pairs
        ],
        background: '/assets/backgrounds/math.png',
        starThresholds: {
          '3stars': { maxTime: 30, maxMoves: 12 },
          '2stars': { maxTime: 60, maxMoves: 20 },
          '1star': { maxTime: 90, maxMoves: 30 },
        },
      },
    },
  ];

  for (const level of mathLevels) {
    await prisma.level.upsert({
      where: { slug: level.slug },
      update: {},
      create: level,
    });
  }

  // 3. Crear Niveles de Palabras (Premium)
  const wordsLevels = [
    {
      title: 'Animales de Granja',
      slug: 'animales-granja',
      difficulty: Difficulty.EASY,
      category: 'words',
      worldId: wordsWorld.id,
      order: 1,
      isPremium: true,
      dataJson: {
        gridSize: { cols: 3, rows: 2 },
        timeLimit: 60,
        pairs: 3,
        theme: 'animals',
        cards: [
          { id: 'cow', image: '/assets/cards/cow.png', label: 'Vaca' },
          { id: 'pig', image: '/assets/cards/pig.png', label: 'Cerdo' },
          { id: 'horse', image: '/assets/cards/horse.png', label: 'Caballo' },
        ],
        background: '/assets/backgrounds/farm.png',
        starThresholds: {
          '3stars': { maxTime: 20, maxMoves: 6 },
          '2stars': { maxTime: 40, maxMoves: 10 },
          '1star': { maxTime: 60, maxMoves: 20 },
        },
      },
    },
  ];

  for (const level of wordsLevels) {
    await prisma.level.upsert({
      where: { slug: level.slug },
      update: {},
      create: level,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
