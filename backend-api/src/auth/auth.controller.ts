import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { TwoFactorService } from './2fa.service.js';
import { UsersService } from '../users/users.service.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
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
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorService: TwoFactorService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * POST /auth/register
   * Registers a new user and returns a JWT access token.
   */
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(
      dto.username,
      dto.password,
      dto.fullName,
      dto.role,
    );
  }

  /**
   * POST /auth/login
   * Authenticates a user and returns a JWT access token.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req()
    req: {
      ip?: string;
      headers?: Record<string, string | string[] | undefined>;
    },
  ) {
    return this.authService.login(dto.username, dto.password, {
      ipAddress: req.ip ?? null,
      userAgent:
        typeof req.headers?.['user-agent'] === 'string'
          ? req.headers['user-agent']
          : null,
    });
  }

  /**
   * POST /auth/login/2fa
   * Verifies the 6-digit TOTP code and returns the full access token.
   */
  @Post('login/2fa')
  @HttpCode(HttpStatus.OK)
  async login2FA(@Body() dto: { tempToken: string; code: string }) {
    return this.authService.verify2FA(dto.tempToken, dto.code);
  }

  /**
   * POST /auth/2fa/generate
   * Generates a 2FA secret and QR code for an authenticated user.
   */
  @Post('2fa/generate')
  @UseGuards(JwtAuthGuard)
  async generate2fa(@Req() req: any) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const { secret, otpauthUrl } =
      this.twoFactorService.generateTwoFactorSecret(user.username);

    // Save the secret temporarily to the user (but don't enable yet)
    await this.usersService.updateTwoFactorSecret(user.userId, secret);

    const qrCode =
      await this.twoFactorService.generateQrCodeDataUrl(otpauthUrl);
    return { qrCode, secret };
  }

  /**
   * POST /auth/2fa/verify-setup
   * Verifies the code and enables 2FA for the user.
   */
  @Post('2fa/verify-setup')
  @UseGuards(JwtAuthGuard)
  async verifySetup2fa(@Req() req: any, @Body() dto: { code: string }) {
    const user = await this.usersService.findById(req.user.userId);
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('User or 2FA secret not found');
    }
    const isValid = this.twoFactorService.verifyTwoFactorToken(
      dto.code,
      user.twoFactorSecret,
    );
    if (isValid) {
      await this.usersService.enableTwoFactor(user.userId);
      return { success: true, message: '2FA enabled successfully' };
    }
    return { success: false, message: 'Invalid 2FA code' };
  }

  /**
   * POST /auth/2fa/disable
   * Disables 2FA for the authenticated user.
   */
  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  async disable2fa(@Req() req: any) {
    await this.usersService.disableTwoFactor(req.user.userId);
    return { success: true, message: '2FA disabled successfully' };
  }
}
