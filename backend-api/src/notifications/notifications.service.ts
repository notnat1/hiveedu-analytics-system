import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => NotificationsGateway))
    private readonly notificationsGateway: NotificationsGateway
  ) { }

  @OnEvent('intervention.alert')
  async handleInterventionAlertEvent(payload: { user: any; predictionData: any }) {
    const { user } = payload;

    // Send Real-time WebSocket Notification
    this.notificationsGateway.sendToUser(user.id, 'notification', {
      title: '⚠️ Peringatan Akademik',
      message: 'Sistem mendeteksi tren penurunan pada performa belajarmu. Segera periksa saran Llama-3 AI di dashboard!',
      type: 'intervention'
    });

    // WhatsApp Alert
    await this.sendWhatsAppAlert(user);
  }

  async sendWhatsAppAlert(user: any) {
    const userkey = process.env.ZENZIVA_USERKEY;
    const passkey = process.env.ZENZIVA_PASSKEY;
    let targetPhone = user.phone || '087872092916'; // Gunakan nomor dummy jika data tidak ada

    // Validasi Payload: Memastikan format internasional (dimulai dengan '62')
    targetPhone = targetPhone.replace(/\D/g, ''); // Hapus semua karakter non-angka
    if (targetPhone.startsWith('0')) {
      targetPhone = '62' + targetPhone.substring(1);
    } else if (!targetPhone.startsWith('62')) {
      targetPhone = '62' + targetPhone;
    }

    if (!userkey || !passkey) {
      this.logger.log(`[SIMULATED WHATSAPP API] Message auto-queued for ${targetPhone}`);
      return;
    }

    // Ekstraksi variabel untuk pesan
    const userName = user.fullName || user.username || 'Siswa';

    // Payload spesifik untuk Endpoint WhatsApp Reguler Zenziva (Tanpa Template)
    const payload = {
      userkey: userkey,
      passkey: passkey,
      to: targetPhone,
      message: `Halo ${userName}! Dari evaluasi sistem akademik terbaru, sepertinya kamu perlu meningkatkan fokus belajar karena grafik performamu membutuhkan perhatian. Segera periksa saran belajarmu di dashboard aplikasi ya. Tetap semangat!`
    };

    try {
      this.logger.log(`Sending WhatsApp alert to ${targetPhone}...`);
      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://console.zenziva.net/wareguler/api/sendWA/',
          payload
        ).pipe(
          catchError((error) => {
            const errorDetails = error.response?.data || error.message;
            this.logger.error(`Failed to send WhatsApp alert. Error from Zenziva: ${JSON.stringify(errorDetails)}`);
            throw new Error(`WhatsApp API Error: ${JSON.stringify(errorDetails)}`);
          })
        )
      );
      this.logger.log(`WhatsApp Gateway Response: ${JSON.stringify(data)}`);
    } catch (e: any) {
      this.logger.error(`Could not complete WhatsApp send operation for ${targetPhone}. Details: ${e.message}`);
    }
  }
}