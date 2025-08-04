import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Log for debugging, remove or comment out in production
    console.log('Required Roles:', requiredRoles);

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role: UserRole };

    console.log('User from request:', user);

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    if (!requiredRoles?.includes(user.role)) {
      throw new ForbiddenException('You do not have the required role');
    }

    return true;
  }
}
