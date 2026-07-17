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
    const targetPhone = user.phone || '6287872092916'; // Use dummy phone if not present

    const buttonJSON = JSON.stringify({
      message: message,
      footer: "HiveEdu Analytics System",
      buttons: [
        {
          id: `ACK_${user.userId}`,
          display_text: "Confirm Attendance"
        },
        {
          url: `http://localhost:3000/dashboard/remedial/${user.userId}`,
          display_text: "View Remedial Module"
        }
      ]
    });

    if (!whatsappToken) {
      this.logger.log(`[SIMULATED WHATSAPP API] Message auto-queued for ${targetPhone}:\n${buttonJSON}`);
      return;
    }

    try {
      this.logger.log(`Sending WhatsApp interactive alert to ${targetPhone}...`);
      const { data } = await firstValueFrom(
        this.httpService.post(
          'https://api.fonnte.com/send',
          { target: targetPhone, buttonJSON: buttonJSON },
          { headers: { Authorization: whatsappToken } }
        ).pipe(
          catchError((error) => {
            this.logger.error('Failed to send WhatsApp alert:', error.response?.data || error.message);
            throw 'An error happened!';
          })
        )
      );
      this.logger.log(`WhatsApp Gateway Response: ${JSON.stringify(data)}`);
    } catch (e) {
      this.logger.error(`Could not complete WhatsApp send operation for ${targetPhone}`);
    }
  }
}
