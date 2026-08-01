import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

@Injectable()
export class TwoFactorService {
  /**
   * Generates a new 2FA secret and OTP Auth URL for Google Authenticator.
   */
  public generateTwoFactorSecret(username: string) {
    const secret = authenticator.generateSecret();
    const appName = 'HiveEdu Analytics';
    const otpauthUrl = authenticator.keyuri(username, appName, secret);
    return { secret, otpauthUrl };
  }

  /**
   * Generates a QR Code Data URL from an OTP Auth URL.
   */
  public async generateQrCodeDataUrl(otpauthUrl: string): Promise<string> {
    return qrcode.toDataURL(otpauthUrl);
  }

  /**
   * Verifies the 6-digit TOTP code against the saved secret.
   */
  public verifyTwoFactorToken(token: string, secret: string): boolean {
    return authenticator.verify({ token, secret });
  }
}
