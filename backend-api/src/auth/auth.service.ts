import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { Role } from '../users/role.enum.js';
import { User } from '../users/user.entity.js';
import { AuditLogService } from '../audit-log/audit-log.service.js';

/**
 * AuthService
 * -------------------------------------------------
 * Handles authentication and JWT token operations for
 * the HiveEdu E-Raport platform.
 *
 * RBAC roles enforced:
 *   - ADMIN   → Data entry operator
 *   - TEACHER → Objective inputs and assessments
 *   - USER    → USER role account (views predictions & reports)
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase — keep USER role wording consistent.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly auditLogService: AuditLogService,
  ) {}

  /**
   * Registers a new user.
   *
   * @param username - Unique username
   * @param password - Plaintext password
   * @param fullName - Full name of the user
   * @param role - Defaults to Role.USER
   * @returns Signed JWT access token.
   */
  async register(
    username: string,
    password: string,
    fullName: string,
    role: Role = Role.USER,
  ): Promise<{ accessToken: string }> {
    const existingUser = await this.usersService.findByUsername(username);
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const newUser = await this.usersService.create({
      username,
      password,
      fullName,
      role,
    });

    return this.generateAccessToken(newUser);
  }

  /**
   * Authenticates a user by validating username and password.
   *
   * @param username - Unique username
   * @param password - Plaintext password
   * @returns Signed JWT access token.
   */
  async login(
    username: string,
    password: string,
    requestMetadata?: { ipAddress?: string | null; userAgent?: string | null },
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findAuthUserByUsername(username);
    if (!user) {
      await this.auditLogService.createLog({
        action: 'LOGIN_FAILED',
        targetType: 'auth',
        description: `Failed login attempt for username "${username}".`,
        metadata: {
          username,
          reason: 'USER_NOT_FOUND',
        },
        ipAddress: requestMetadata?.ipAddress ?? null,
        userAgent: requestMetadata?.userAgent ?? null,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      await this.auditLogService.createLog({
        action: 'LOGIN_FAILED',
        actorId: user.userId,
        actorRole: user.role,
        targetType: 'auth',
        targetId: user.userId,
        description: `Failed login attempt for username "${username}".`,
        metadata: {
          username,
          reason: 'MISSING_PASSWORD_HASH',
        },
        ipAddress: requestMetadata?.ipAddress ?? null,
        userAgent: requestMetadata?.userAgent ?? null,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      await this.auditLogService.createLog({
        action: 'LOGIN_FAILED',
        actorId: user.userId,
        actorRole: user.role,
        targetType: 'auth',
        targetId: user.userId,
        description: `Failed login attempt for username "${username}".`,
        metadata: {
          username,
          reason: 'INVALID_PASSWORD',
        },
        ipAddress: requestMetadata?.ipAddress ?? null,
        userAgent: requestMetadata?.userAgent ?? null,
      });
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.auditLogService.createLog({
      action: 'LOGIN_SUCCESS',
      actorId: user.userId,
      actorRole: user.role,
      targetType: 'auth',
      targetId: user.userId,
      description: `Successful login for username "${username}".`,
      metadata: {
        username,
      },
      ipAddress: requestMetadata?.ipAddress ?? null,
      userAgent: requestMetadata?.userAgent ?? null,
    });

    return this.generateAccessToken(user);
  }

  /**
   * Generate a JWT access token for an authenticated user.
   *
   * @param user - The authenticated User entity
   * @returns Object containing signed JWT access token string.
   */
  async generateAccessToken(user: User): Promise<{ accessToken: string }> {
    const payload = {
      sub: user.userId,
      username: user.username,
      role: user.role,
    };
    const token = await this.jwtService.signAsync(payload);
    return { accessToken: token };
  }

  /**
   * Validate a JWT token and extract the payload.
   *
   * @param token - The JWT token string to validate.
   * @returns Decoded payload if valid, or null.
   */
  async validateToken(token: string): Promise<{ sub: string; role: string } | null> {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        role: string;
      }>(token);
      return payload;
    } catch {
      return null;
    }
  }
}
