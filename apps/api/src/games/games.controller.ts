import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { GamesService } from './games.service';

interface SaveProgressBody {
  childId: string;
  levelId: string;
  stars: number;
  time: number;
  moves: number;
  completed: boolean;
}

interface StartSessionBody {
  childId: string;
  levelId: string;
}

interface EndSessionBody {
  score: number;
  moves: number;
  timeSpent: number;
  completed: boolean;
}

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get('worlds')
  async getWorlds() {
    return this.gamesService.getWorlds();
  }

  @Get('worlds/:worldId')
  async getWorld(@Param('worldId') worldId: string) {
    return this.gamesService.getWorld(worldId);
  }

  @Get('levels/:levelId')
  async getLevel(@Param('levelId') levelId: string) {
    return this.gamesService.getLevel(levelId);
  }

  @Post('progress')
  async saveProgress(@Body() body: SaveProgressBody) {
    return this.gamesService.saveProgress(body);
  }

  @Post('sessions')
  async startSession(@Body() body: StartSessionBody) {
    return this.gamesService.startSession(body);
  }

  @Post('sessions/:sessionId/end')
  async endSession(@Param('sessionId') sessionId: string, @Body() body: EndSessionBody) {
    return this.gamesService.endSession(sessionId, body);
  }
}
