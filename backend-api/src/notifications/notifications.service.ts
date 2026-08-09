import {
  Injectable,
  Logger,
  Inject,
  forwardRef,
  OnModuleInit,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // Rate limiting maps: userId -> timestamp (ms)
  private readonly lastInAppAlerts = new Map<string, number>();
  private readonly lastWaAlerts = new Map<string, number>();

  // Cooldown durations
  private readonly IN_APP_COOLDOWN = 60 * 60 * 1000; // 1 hour
  private readonly WA_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

  // Anti-Ban WhatsApp Queue
  private readonly waQueue: any[] = [];
  private isProcessingWaQueue = false;

  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  onModuleInit() {
    // Start queue processor running in background
    this.processWaQueue();
  }

  @OnEvent('intervention.alert')
  async handleInterventionAlertEvent(payload: {
    user: any;
    predictionData?: any;
  }) {
    const { user } = payload;
    const userId = user.userId;
    const now = Date.now();

    // 1. Process In-App Alert (1 hour cooldown)
    const lastInApp = this.lastInAppAlerts.get(userId) || 0;
    if (now - lastInApp >= this.IN_APP_COOLDOWN) {
      this.notificationsGateway.sendToUser(userId, 'notification', {
        title: '⚠️ Peringatan Akademik',
        message:
          'Sistem mendeteksi tren penurunan pada performa belajarmu. Segera periksa saran AI di dashboard!',
        type: 'intervention',
      });
      this.lastInAppAlerts.set(userId, now);
      this.logger.log(`In-app notification sent for user ${userId}`);
    } else {
      this.logger.log(
        `Skipped in-app notification for user ${userId} (cooldown active)`,
      );
    }

    // 2. Process WhatsApp Alert (24 hours cooldown)
    const lastWa = this.lastWaAlerts.get(userId) || 0;
    if (now - lastWa >= this.WA_COOLDOWN) {
      this.waQueue.push(user);
      this.lastWaAlerts.set(userId, now);
      this.logger.log(`Queued WhatsApp alert for user ${userId}`);
    } else {
      this.logger.log(
        `Skipped WhatsApp notification for user ${userId} (cooldown active)`,
      );
    }
  }

  private async processWaQueue() {
    if (this.isProcessingWaQueue) return;
    this.isProcessingWaQueue = true;

    // Run endlessly in the background
    while (true) {
      if (this.waQueue.length > 0) {
        const user = this.waQueue.shift();
        if (user) {
          try {
            await this.sendWhatsAppAlert(user);
          } catch (e: any) {
            this.logger.error(
              `Error processing WA queue for user ${user.userId}: ${e.message}`,
            );
          }
          // Random delay between 15s and 25s
          const delay = Math.floor(Math.random() * (25000 - 15000 + 1)) + 15000;
          this.logger.log(
            `WhatsApp queue sleeping for ${delay}ms to avoid spam detection...`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } else {
        // Queue empty, wait 5 seconds before checking again
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  async sendWhatsAppAlert(user: any) {
    if (!user.phone) {
      this.logger.log(
        `Skipped WhatsApp alert for user ${user.userId}: No phone number registered.`,
      );
      return;
    }

    const openwaUrl = process.env.OPENWA_API_URL || 'http://localhost:8002';
    const openwaKey = process.env.OPENWA_API_KEY || 'hiveedu_secret';
    let targetPhone = user.phone;

    // Validasi Payload: Memastikan format internasional (dimulai dengan '62')
    targetPhone = targetPhone.replace(/\D/g, ''); // Hapus semua karakter non-angka
    if (targetPhone.startsWith('0')) {
      targetPhone = '62' + targetPhone.substring(1);
    } else if (!targetPhone.startsWith('62')) {
      targetPhone = '62' + targetPhone;
    }

    if (!openwaUrl) {
      this.logger.log(
        `[SIMULATED WHATSAPP API] Message auto-queued for ${targetPhone}`,
      );
      return;
    }

    // Ekstraksi variabel untuk pesan
    const userName = user.fullName || user.username || 'Siswa';

    // Endpoint WPPConnect: Generate Token
    // Format WPPConnect: /api/{session}/{secretkey}/generate-token
    const generateTokenUrl = `${openwaUrl}/api/pesan2/${openwaKey}/generate-token`;
    const sendMessageUrl = `${openwaUrl}/api/pesan2/send-message`;

    try {
      this.logger.log(`Authenticating with WPPConnect...`);
      // 1. Dapatkan Token JWT
      const authResponse = await firstValueFrom(
        this.httpService.post(generateTokenUrl, null).pipe(
          catchError((error) => {
            this.logger.error(`WPPConnect Auth Error: ${error.message}`);
            throw new Error('Failed to authenticate with WPPConnect');
          }),
        ),
      );

      const token = authResponse.data?.token;

      // 2. Kirim Pesan
      const payload = {
        phone: targetPhone,
        message: `Halo ${userName}! Dari evaluasi sistem akademik terbaru, sepertinya kamu perlu meningkatkan fokus belajar karena grafik performamu membutuhkan perhatian. Segera periksa saran belajarmu di dashboard aplikasi ya. Tetap semangat!`,
        isGroup: false,
      };

      this.logger.log(
        `Sending WhatsApp alert to ${targetPhone} via WPPConnect...`,
      );
      const { data } = await firstValueFrom(
        this.httpService
          .post(sendMessageUrl, payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
          .pipe(
            catchError((error) => {
              const errorDetails = error.response?.data || error.message;
              this.logger.error(
                `Failed to send WhatsApp alert. Error from WPPConnect: ${JSON.stringify(errorDetails)}`,
              );
              throw new Error(
                `WPPConnect API Error: ${JSON.stringify(errorDetails)}`,
              );
            }),
          ),
      );
      this.logger.log(`WhatsApp Gateway Response: ${JSON.stringify(data)}`);
    } catch (e: any) {
      this.logger.error(
        `Could not complete WhatsApp send operation for ${targetPhone}. Details: ${e.message}`,
      );
    }
  }
}
