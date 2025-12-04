import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * Guard to check if user is admin
 * Only admins can manage users and groups
 */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (!user.isAdmin) {
      throw new ForbiddenException('Only administrators can perform this action');
    }

    return true;
  }
}
