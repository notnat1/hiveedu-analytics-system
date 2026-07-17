import { SetMetadata } from '@nestjs/common';
import { Role } from '../users/role.enum.js';

/**
 * Metadata key for the @Roles() decorator.
 */
export const ROLES_KEY = 'roles';

/**
 * @Roles() Decorator
 * -------------------------------------------------
 * Attach required RBAC roles to a controller or handler method.
 * Used in combination with JwtAuthGuard to enforce role-based access.
 *
 * Usage:
 *   @Roles(Role.ADMIN, Role.TEACHER)
 *   @UseGuards(JwtAuthGuard)
 *   @Get('protected-route')
 *   async protectedAction() { ... }
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase â€” keep USER role wording consistent.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
