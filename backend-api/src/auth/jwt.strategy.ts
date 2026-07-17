import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT payload structure used across the HiveEdu E-Raport platform.
 */
interface JwtPayload {
  /** Subject â€” the user's UUID */
  sub: string;

  /** The user's RBAC role (ADMIN | TEACHER | USER) */
  role: string;
}

/**
 * JwtStrategy
 * -------------------------------------------------
 * Passport strategy for validating JWT Bearer tokens.
 * Extracts and verifies the JWT from the Authorization header.
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase â€” keep USER role wording consistent.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'hiveedu_default_secret'),
    });
  }

  /**
   * Called by Passport after JWT is verified.
   * The returned object is attached to `request.user`.
   */
  async validate(payload: JwtPayload): Promise<{ userId: string; role: string }> {
    return { userId: payload.sub, role: payload.role };
  }
}
