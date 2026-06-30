import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaymentProvider, Role, SubscriptionStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PlanType } from '@aventuras/shared';

interface AuthUser {
  userId: string;
  email?: string;
}

interface SubscriptionView {
  status: SubscriptionStatus;
  provider: PaymentProvider | null;
  mpPreapprovalPlanId: string | null;
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
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateUser(authUser: AuthUser, update: UserUpdate) {
    if (!authUser.userId) {
      throw new BadRequestException('Missing authenticated user id');
    }

    const updateData = {
      ...(update.displayName !== undefined ? { displayName: update.displayName } : {}),
      ...(update.avatarUrl !== undefined ? { avatarUrl: update.avatarUrl } : {}),
    };

    const existingBySupabaseId = await this.prisma.user.findFirst({
      where: { supabaseId: authUser.userId },
      orderBy: { createdAt: 'asc' },
    });

    const existingByEmail = authUser.email
      ? await this.prisma.user.findFirst({
          where: { email: authUser.email },
          orderBy: { createdAt: 'asc' },
        })
      : null;

    const existingUser = existingBySupabaseId ?? existingByEmail;

    if (existingUser) {
      const shouldSyncSupabaseId = existingUser.supabaseId !== authUser.userId;
      const nextUpdateData = {
        ...updateData,
        ...(shouldSyncSupabaseId ? { supabaseId: authUser.userId } : {}),
      };

      if (Object.keys(nextUpdateData).length === 0) {
        const user = await this.prisma.user.findUnique({
          where: { id: existingUser.id },
          include: {
            children: true,
            subscription: true,
          },
        });

        if (user) {
          return this.withSubscriptionView(user);
        }
      }

      try {
        const user = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: nextUpdateData,
          include: {
            children: true,
            subscription: true,
          },
        });

        return this.withSubscriptionView(user);
      } catch (error) {
        this.logger.error(`Failed to update user ${existingUser.id}`, error as Error);

        const recoveredUser = await this.prisma.user.findFirst({
          where: {
            OR: [{ supabaseId: authUser.userId }, ...(authUser.email ? [{ email: authUser.email }] : [])],
          },
          include: {
            children: true,
            subscription: true,
          },
          orderBy: { createdAt: 'asc' },
        });

        if (recoveredUser) {
          return this.withSubscriptionView(recoveredUser);
        }

        throw error;
      }
    }

    try {
      const user = await this.prisma.user.create({
        data: {
          supabaseId: authUser.userId,
          email: authUser.email ?? `${authUser.userId}@supabase.local`,
          displayName: update.displayName ?? null,
          avatarUrl: update.avatarUrl ?? null,
          role: Role.PARENT,
        },
        include: {
          children: true,
          subscription: true,
        },
      });

      return this.withSubscriptionView(user);
    } catch (error) {
      this.logger.error(`Failed to create user ${authUser.userId}`, error as Error);

      const recoveredUser = await this.prisma.user.findFirst({
        where: {
          OR: [{ supabaseId: authUser.userId }, ...(authUser.email ? [{ email: authUser.email }] : [])],
        },
        include: {
          children: true,
          subscription: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      if (recoveredUser) {
        return this.withSubscriptionView(recoveredUser);
      }

      throw error;
    }
  }

  async getChildren(userId: string) {
    return this.prisma.childProfile.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createChild(userId: string, input: ChildProfileInput) {
    const cleanInput = this.validateChildInput(input);

    // Verificar límite de perfiles según suscripción
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { children: true, subscription: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hasFamilyPack = this.isFamilyPackEnabled(user.subscription);
    const maxProfiles = hasFamilyPack ? 4 : 1;

    if (user.children.length >= maxProfiles) {
      throw new BadRequestException(
        hasFamilyPack
          ? 'Has alcanzado el límite de perfiles familiares permitidos (4).'
          : 'Necesitas el pack familiar para agregar perfiles familiares adicionales.',
      );
    }

    if (!hasFamilyPack && user.children.length > 0) {
      throw new BadRequestException('Necesitas el pack familiar para agregar perfiles familiares adicionales.');
    }

    try {
      return await this.prisma.childProfile.create({
        data: {
          userId,
          ...cleanInput,
        },
      });
    } catch (error) {
      this.logger.error(`Failed to create child profile for user ${userId}`, error as Error);
      throw error;
    }
  }

  async updateChild(userId: string, childId: string, input: Partial<ChildProfileInput>) {
    await this.ensureChildBelongsToUser(userId, childId);

    const data: Partial<ChildProfileInput> = {};
    if (input.name !== undefined) data.name = this.validateName(input.name);
    if (input.age !== undefined) data.age = this.validateAge(input.age);
    if (input.avatarId !== undefined) data.avatarId = input.avatarId.trim() || 'default';

    try {
      return await this.prisma.childProfile.update({
        where: { id: childId },
        data,
      });
    } catch (error) {
      this.logger.error(`Failed to update child profile ${childId} for user ${userId}`, error as Error);
      throw error;
    }
  }

  async deleteChild(userId: string, childId: string) {
    await this.ensureChildBelongsToUser(userId, childId);
    try {
      await this.prisma.childProfile.delete({ where: { id: childId } });
      return { deleted: true };
    } catch (error) {
      this.logger.error(`Failed to delete child profile ${childId} for user ${userId}`, error as Error);
      throw error;
    }
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

  private isFamilyPackEnabled(subscription: SubscriptionView | null | undefined) {
    if (!subscription || subscription.status !== SubscriptionStatus.ACTIVE) {
      return false;
    }
    if (subscription.provider === PaymentProvider.MERCADO_PAGO) {
      return subscription.mpPreapprovalPlanId === PlanType.FAMILY;
    }

    return false;
  }

  private withSubscriptionView<T extends { subscription?: SubscriptionView | null }>(user: T) {
    return {
      ...user,
      subscription: user.subscription
        ? {
            ...user.subscription,
            familyPackEnabled: this.isFamilyPackEnabled(user.subscription),
          }
        : null,
    };
  }
}
