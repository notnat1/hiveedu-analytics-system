import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly httpService: HttpService) { }

  @OnEvent('intervention.alert')
  async handleInterventionAlertEvent(payload: { user: any; predictionData: any }) {
    const { user, predictionData } = payload;

    // Fonnte Button Template Message
    const message = `⚠️ *Early Warning Alert* ⚠️\n\nStudent: ${user.fullName || user.username}\nRisk Level: ${predictionData.riskLevel}\nPredicted Score: ${predictionData.predictedScore}\n\nPrescriptions:\n${predictionData.prescriptions?.map((p: any) => `- [${p.action}] ${p.module}`).join('\n')}`;

    await this.sendWhatsAppAlert(user, message);
  }

  async sendWhatsAppAlert(user: any, message: string) {
    const whatsappToken = process.env.WHATSAPP_TOKEN;
    let targetPhone = user.phone || '087872092916'; // Use dummy phone if not present

    // Payload validation: Ensure the phone number uses the international format (starting with '62')
    targetPhone = targetPhone.replace(/\D/g, ''); // strip non-digits
    if (targetPhone.startsWith('0')) {
      targetPhone = '62' + targetPhone.substring(1);
    } else if (!targetPhone.startsWith('62')) {
      targetPhone = '62' + targetPhone;
    }

    if (!whatsappToken) {
      this.logger.log(`[SIMULATED WHATSAPP API] Message auto-queued for ${targetPhone}`);
      return;
    }

    // Fonnte has officially deprecated Interactive Buttons (buttonJSON / buttons).
    // The API accepts the request but drops the message silently. 
    // We must append the actions as standard text instead.
    const textMessage = `${message}\n\n` +
      `🔗 *View Remedial Module*:\nhttp://localhost:3000/dashboard/remedial/${user.userId}\n\n` +
      `✅ *Confirm Attendance*:\nPlease reply to this message with: ACK_${user.userId}`;

    const payload = {
      target: targetPhone,
      message: textMessage
    };

    try {
      this.logger.log(`Sending WhatsApp alert to ${targetPhone}...`);
      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://api.fonnte.com/send',
          payload,
          { headers: { Authorization: whatsappToken } }
        ).pipe(
          catchError((error) => {
            const errorDetails = error.response?.data || error.message;
            this.logger.error(`Failed to send WhatsApp alert. Error from Fonnte: ${JSON.stringify(errorDetails)}`);
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
