import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

/**
 * AuthController
 * -------------------------------------------------
 * Handles authentication endpoints (login, register)
 * for the HiveEdu E-Raport platform.
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase — keep USER role wording consistent.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Registers a new user and returns a JWT access token.
   */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.username, dto.password, dto.fullName, dto.role);
  }

  /**
   * POST /auth/login
   * Authenticates a user and returns a JWT access token.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: { ip?: string; headers?: Record<string, string | string[] | undefined> },
  ) {
    return this.authService.login(dto.username, dto.password, {
      ipAddress: req.ip ?? null,
      userAgent:
        typeof req.headers?.['user-agent'] === 'string'
          ? req.headers['user-agent']
          : null,
    });
  }
}
