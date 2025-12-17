import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GROUPS_KEY } from '../decorators/group.decorator';

/**
 * Guard to check if user belongs to required groups
 * Usage: @Groups('RH', 'COM')
 */
@Injectable()
export class GroupsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredGroups = this.reflector.getAllAndOverride<string[]>(GROUPS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredGroups || requiredGroups.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user || !user.group) {
      return false;
    }

    return requiredGroups.some((groupCode) => user.group.code === groupCode);
  }
}
