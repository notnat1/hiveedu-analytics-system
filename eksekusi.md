Act as a Senior NestJS Backend Engineer. We are moving to Phase 2 of our web-based electronic report card system (which utilizes Linear Regression for predictive analytics).

Context:
Our notification pipeline via Zenziva WhatsApp Official API is already set up and triggered via the 'intervention.alert' event in NotificationsService.

Objectives for this prompt:
Implement 3 new core features using Clean Architecture principles (Controllers, Services, Modules).

1. CRON JOB (Automated Early Warning)
- Install and configure '@nestjs/schedule' if not already present.
- Create a 'CronService' that runs daily (e.g., at 08:00 AM).
- The job should query the database for students whose latest Linear Regression predicted score falls below the passing threshold (e.g., < 70).
- For each at-risk student, trigger the existing 'intervention.alert' event.

2. EXPLAINABLE AI (XAI) GENERATOR
- Create an 'XaiService'.
- This service should take the input variables of the Linear Regression model (e.g., attendance rate, past assignment scores, quiz averages) and generate a human-readable explanation (string) of why the predicted score is what it is.
- Example output: "The predicted score of 65 is heavily influenced by a 15% drop in attendance and a low score on Assignment 3."
- Integrate this XAI string into the prediction results payload.

3. AUDIT LOGGING SYSTEM
- Create an 'AuditLogModule' and 'AuditLogService'.
- Implement a mechanism (can be an Interceptor or a globally accessible Service) to record critical system events to the database.
- Data to log: timestamp, actionType (e.g., 'SYSTEM_PREDICTION', 'WHATSAPP_SENT', 'DATA_UPDATE'), userId (if triggered by a user, or 'SYSTEM' for cron jobs), and details (JSON format).

Constraints & Best Practices:
- Use TypeScript strictly.
- Ensure proper dependency injection.
- Do not rewrite existing modules (like NotificationsService), only import and interact with them.
- Provide the complete code for the new Modules, Controllers, Services, and any necessary Prisma/TypeORM schema updates for the Audit Log.