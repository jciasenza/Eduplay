import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';
import { UsersService } from './users.service';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email?: string;
  };
}

interface UpsertMeBody {
  displayName?: string;
  avatarUrl?: string;
}

interface ChildProfileBody {
  name: string;
  age: number;
  avatarId?: string;
}

@UseGuards(SupabaseAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    return this.usersService.getOrCreateUser(req.user, {});
  }

  @Patch('me')
  async updateMe(@Req() req: AuthenticatedRequest, @Body() body: UpsertMeBody) {
    return this.usersService.getOrCreateUser(req.user, body);
  }

  @Get('me/children')
  async getChildren(@Req() req: AuthenticatedRequest) {
    const user = await this.usersService.getOrCreateUser(req.user, {});
    return this.usersService.getChildren(user.id);
  }

  @Post('me/children')
  async createChild(@Req() req: AuthenticatedRequest, @Body() body: ChildProfileBody) {
    const user = await this.usersService.getOrCreateUser(req.user, {});
    return this.usersService.createChild(user.id, body);
  }

  @Patch('me/children/:childId')
  async updateChild(
    @Req() req: AuthenticatedRequest,
    @Param('childId') childId: string,
    @Body() body: Partial<ChildProfileBody>,
  ) {
    const user = await this.usersService.getOrCreateUser(req.user, {});
    return this.usersService.updateChild(user.id, childId, body);
  }

  @Delete('me/children/:childId')
  async deleteChild(@Req() req: AuthenticatedRequest, @Param('childId') childId: string) {
    const user = await this.usersService.getOrCreateUser(req.user, {});
    return this.usersService.deleteChild(user.id, childId);
  }
}
