import { Controller, Post, Body, Logger, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Controller('notifications')
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleFonnteWebhook(@Body() payload: any) {
    this.logger.log(`Received Fonnte webhook: ${JSON.stringify(payload)}`);
    
    // Fonnte sends the button ID in the 'button' field for interactive button replies
    const buttonId = payload.button;

    if (buttonId && typeof buttonId === 'string' && buttonId.startsWith('ACK_')) {
      const userId = buttonId.replace('ACK_', '');
      
      try {
        await this.usersService.acknowledgeWarning(userId);
        this.logger.log(`Successfully acknowledged warning for user ${userId}`);
      } catch (error: any) {
        this.logger.error(`Failed to acknowledge warning for user ${userId}: ${error.message}`);
      }
    }
    
    // Always return 200 OK so Fonnte knows the webhook was received
    return { status: 'success' };
  }
}
