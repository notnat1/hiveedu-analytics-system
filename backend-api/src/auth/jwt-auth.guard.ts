import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator.js';
import { Role } from '../users/role.enum.js';

/**
 * JwtAuthGuard
 * -------------------------------------------------
 * Extends Passport's AuthGuard to enforce JWT authentication.
 * Can optionally enforce RBAC by checking the @Roles() decorator.
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase â€” keep USER role wording consistent.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * After JWT validation, check if the user's role matches
   * any roles specified by the @Roles() decorator on the handler.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, run the standard JWT validation
    const isAuthenticated = await (super.canActivate(context) as Promise<boolean>);
    if (!isAuthenticated) {
      return false;
    }

    // Check for RBAC role requirements
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no @Roles() decorator is present, allow access (authenticated is enough)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: { role: string } }>();
    const userRole = request.user?.role;

    return requiredRoles.some((role) => role === userRole);
  }
}
