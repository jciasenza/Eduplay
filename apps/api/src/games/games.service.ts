import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Level, World } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type WorldWithLevels = World & { levels: Level[] };

interface SaveProgressInput {
  childId: string;
  levelId: string;
  stars: number;
  time: number;
  moves: number;
  completed: boolean;
}

interface StartSessionInput {
  childId: string;
  levelId: string;
}

interface EndSessionInput {
  score: number;
  moves: number;
  timeSpent: number;
  completed: boolean;
}

const worldMetadata = {
  matematicas: {
    id: 'math',
    icon: '#',
    accent: 'blue',
    badge: 'Gratis',
    characterName: 'Numi',
    characterRole: 'Guardian de numeros',
    characterImage: '/numi.png',
    game: {
      id: 'memorittest',
      title: 'Memotest numerico',
      description: 'Busca las parejas y practica numeros en un reto rapido.',
      icon: '🔢',
      route: 'memorittest',
      status: 'available',
    },
  },
  palabras: {
    id: 'words',
    icon: 'Aa',
    accent: 'pink',
    badge: 'Premium',
    characterName: 'Lira',
    characterRole: 'Exploradora de letras',
    characterImage: '/lira.png',
    game: {
      id: 'lectura-rapida',
      title: 'Lectura rápida',
      description: 'Practica palabras y silabas en un juego rapido.',
      icon: '📚',
      route: 'lectura-rapida',
      status: 'premium',
    },
  },
  'ciencias-naturales': {
    id: 'natural-science',
    icon: 'Ci',
    accent: 'green',
    badge: 'Pronto',
    characterName: 'Natu',
    characterRole: 'Guia de descubrimientos',
    characterImage: '/natu.png',
    game: {
      id: 'explora-y-descubre',
      title: 'Explora y descubre',
      description: 'Proximamente: juegos de ciencia y curiosidades.',
      icon: '🧪',
      route: 'explora-y-descubre',
      status: 'coming-soon',
    },
  },
  historia: {
    id: 'history',
    icon: 'Hi',
    accent: 'orange',
    badge: 'Pronto',
    characterName: 'Crono',
    characterRole: 'Viajero del tiempo',
    characterImage: '/crono.png',
    game: {
      id: 'tiempo-magico',
      title: 'Tiempo magico',
      description: 'Proximamente: descubre historias en forma de juego.',
      icon: '⏳',
      route: 'tiempo-magico',
      status: 'coming-soon',
    },
  },
  logica: {
    id: 'logic',
    icon: 'Lo',
    accent: 'purple',
    badge: 'Nuevo',
    characterName: 'Pixel',
    characterRole: 'Entrenador mental',
    characterImage: '/pixel.png',
    game: {
      id: 'reto-mental',
      title: 'Reto mental',
      description: 'Proximamente: juegos de logica y patrones.',
      icon: '🧠',
      route: 'reto-mental',
      status: 'coming-soon',
    },
  },
} as const;

const defaultWorldMetadata = {
  icon: '★',
  accent: 'blue',
  badge: 'Nuevo',
  characterName: 'Edu',
  characterRole: 'Guia de aprendizaje',
  characterImage: '/eduplay.png',
} as const;

@Injectable()
export class GamesService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorlds() {
    const worlds = await this.prisma.world.findMany({
      where: { isActive: true },
      include: {
        levels: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return worlds.map((world) => this.mapWorld(world));
  }

  async getWorld(worldId: string) {
    const worlds = await this.getWorlds();
    const world = worlds.find((item) => item.id === worldId || item.sourceSlug === worldId);

    if (!world) {
      throw new NotFoundException('World not found');
    }

    return world;
  }

  async getLevel(levelId: string) {
    const level = await this.prisma.level.findFirst({
      where: {
        OR: [{ id: levelId }, { slug: levelId }],
        isActive: true,
      },
      include: { world: true },
    });

    if (!level) {
      throw new NotFoundException('Level not found');
    }

    return this.mapLevel(level);
  }

  async saveProgress(input: SaveProgressInput) {
    this.validateProgress(input);

    const currentProgress = await this.prisma.gameProgress.findUnique({
      where: {
        childId_levelId: {
          childId: input.childId,
          levelId: input.levelId,
        },
      },
    });
    const bestStars = Math.max(currentProgress?.stars ?? 0, input.stars);
    const bestTime = currentProgress?.bestTime
      ? Math.min(currentProgress.bestTime, input.time)
      : input.time;

    return this.prisma.gameProgress.upsert({
      where: {
        childId_levelId: {
          childId: input.childId,
          levelId: input.levelId,
        },
      },
      update: {
        stars: bestStars,
        bestTime,
        completed: currentProgress?.completed || input.completed,
        attempts: { increment: 1 },
      },
      create: {
        childId: input.childId,
        levelId: input.levelId,
        stars: input.stars,
        bestTime: input.time,
        completed: input.completed,
        attempts: 1,
      },
    });
  }

  async startSession(input: StartSessionInput) {
    if (!input.childId || !input.levelId) {
      throw new BadRequestException('childId and levelId are required');
    }

    return this.prisma.gameSession.create({
      data: {
        childId: input.childId,
        levelId: input.levelId,
      },
    });
  }

  async endSession(sessionId: string, input: EndSessionInput) {
    return this.prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        score: Number(input.score) || 0,
        moves: Number(input.moves) || 0,
        timeSpent: Number(input.timeSpent) || 0,
        completed: Boolean(input.completed),
      },
    });
  }

  private mapWorld(world: WorldWithLevels) {
    const metadata =
      worldMetadata[world.slug as keyof typeof worldMetadata] ??
      this.createFallbackMetadata(world);
    const game = metadata.game ?? this.createFallbackGame(world);

    return {
      id: metadata.id ?? world.slug,
      sourceId: world.id,
      sourceSlug: world.slug,
      title: world.name,
      description: world.description ?? '',
      icon: metadata.icon,
      accent: metadata.accent,
      badge: world.isPremium ? 'Premium' : metadata.badge,
      actionLabel: 'Ver mundo',
      locked: world.isPremium,
      progress: 0,
      characterName: metadata.characterName,
      characterRole: metadata.characterRole,
      characterImage: metadata.characterImage,
      games: [
        {
          ...game,
          locked: world.isPremium,
          levels: world.levels.map((level) => this.mapLevel(level)),
        },
      ],
    };
  }

  private mapLevel(level: Level) {
    const data = level.dataJson as {
      timeLimit?: number;
      gridSize?: { cols: number; rows: number };
    };

    return {
      id: level.slug,
      sourceId: level.id,
      title: level.title,
      timeLimit: data.timeLimit ?? 60,
      gridSize: data.gridSize ?? { cols: 4, rows: 3 },
      isPremium: level.isPremium,
      difficulty: level.difficulty,
      category: level.category,
      data,
    };
  }

  private createFallbackMetadata(world: World) {
    return {
      id: world.slug,
      ...defaultWorldMetadata,
      badge: world.isPremium ? 'Premium' : defaultWorldMetadata.badge,
      game: this.createFallbackGame(world),
    };
  }

  private createFallbackGame(world: World) {
    return {
      id: `${world.slug}-game`,
      title: world.name,
      description: world.description ?? 'Juegos educativos del mundo.',
      icon: world.iconUrl ?? defaultWorldMetadata.icon,
      route: `${world.slug}-game`,
      status: world.isPremium ? 'premium' : 'available',
    };
  }

  private validateProgress(input: SaveProgressInput) {
    if (!input.childId || !input.levelId) {
      throw new BadRequestException('childId and levelId are required');
    }

    if (input.stars < 0 || input.stars > 3) {
      throw new BadRequestException('stars must be between 0 and 3');
    }
  }
}
