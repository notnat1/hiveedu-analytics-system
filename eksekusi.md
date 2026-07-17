Act as a Senior Backend Engineer. Our current WhatsApp notification is failing to deliver because the payload structure sent to Fonnte API is not correctly formatted for interactive messages.

Please modify the sendWhatsAppAlert function in notifications.service.ts to strictly adhere to the Fonnte API specification for interactive messages.

Correct the payload structure: Ensure the request body is a properly formatted object (not just a stringified JSON) that includes the token, phone, message, footer, and buttons array as top-level properties.

Fix the button syntax: Use the correct Fonnte parameter names (display_text for buttons, id for reply buttons, and url for link buttons).

Implement robust error handling: Add proper logging to capture the response from Fonnte API when a message fails to send, so we can see the exact error returned by their server.

Payload validation: Ensure the phone number uses the international format (starting with '62') before the API call is executed.

After applying these changes, we need to verify that the terminal shows a successful response from Fonnte API. Do not add any other features; focus solely on making the interactive notification delivery 100% reliable.