import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface AuthUser {
  userId: string;
  email?: string;
}

interface UserUpdate {
  displayName?: string;
  avatarUrl?: string;
}

interface ChildProfileInput {
  name: string;
  age: number;
  avatarId?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateUser(authUser: AuthUser, update: UserUpdate) {
    if (!authUser.userId) {
      throw new BadRequestException('Missing authenticated user id');
    }

    const updateData = {
      ...(authUser.email ? { email: authUser.email } : {}),
      ...(update.displayName !== undefined ? { displayName: update.displayName } : {}),
      ...(update.avatarUrl !== undefined ? { avatarUrl: update.avatarUrl } : {}),
    };

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { supabaseId: authUser.userId },
          ...(authUser.email ? [{ email: authUser.email }] : []),
        ],
      },
    });

    if (existingUser) {
      return this.prisma.user.update({
        where: { id: existingUser.id },
        data: {
          supabaseId: authUser.userId,
          ...updateData,
        },
        include: {
          children: true,
        },
      });
    }

    return this.prisma.user.create({
      data: {
        supabaseId: authUser.userId,
        email: authUser.email ?? `${authUser.userId}@supabase.local`,
        displayName: update.displayName ?? null,
        avatarUrl: update.avatarUrl ?? null,
        role: Role.PARENT,
      },
      include: {
        children: true,
      },
    });
  }

  async getChildren(userId: string) {
    return this.prisma.childProfile.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createChild(userId: string, input: ChildProfileInput) {
    const cleanInput = this.validateChildInput(input);

    return this.prisma.childProfile.create({
      data: {
        userId,
        ...cleanInput,
      },
    });
  }

  async updateChild(userId: string, childId: string, input: Partial<ChildProfileInput>) {
    await this.ensureChildBelongsToUser(userId, childId);

    const data: Partial<ChildProfileInput> = {};
    if (input.name !== undefined) data.name = this.validateName(input.name);
    if (input.age !== undefined) data.age = this.validateAge(input.age);
    if (input.avatarId !== undefined) data.avatarId = input.avatarId.trim() || 'default';

    return this.prisma.childProfile.update({
      where: { id: childId },
      data,
    });
  }

  async deleteChild(userId: string, childId: string) {
    await this.ensureChildBelongsToUser(userId, childId);
    await this.prisma.childProfile.delete({ where: { id: childId } });
    return { deleted: true };
  }

  private async ensureChildBelongsToUser(userId: string, childId: string) {
    const child = await this.prisma.childProfile.findFirst({
      where: { id: childId, userId },
    });

    if (!child) {
      throw new NotFoundException('Child profile not found');
    }
  }

  private validateChildInput(input: ChildProfileInput): ChildProfileInput {
    return {
      name: this.validateName(input.name),
      age: this.validateAge(input.age),
      avatarId: input.avatarId?.trim() || 'default',
    };
  }

  private validateName(name: string) {
    const cleanName = name?.trim();
    if (!cleanName || cleanName.length < 2) {
      throw new BadRequestException('Child name must have at least 2 characters');
    }

    return cleanName;
  }

  private validateAge(age: number) {
    const cleanAge = Number(age);
    if (!Number.isInteger(cleanAge) || cleanAge < 3 || cleanAge > 12) {
      throw new BadRequestException('Child age must be between 3 and 12');
    }

    return cleanAge;
  }
}
