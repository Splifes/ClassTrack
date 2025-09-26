import os
import requests
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

class NotificationService:
    def __init__(self):
        self.sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        self.sender_email = os.environ.get('SENDGRID_SENDER_EMAIL', 'noreply@classtrack.app')
        self.whatsapp_service_url = os.environ.get('WHATSAPP_SERVICE_URL', 'http://localhost:3001/send')

    def send_email(self, to_email: str, subject: str, html_content: str):
        """Envia un correo electrónico usando SendGrid."""
        if not self.sg:
            print("WARN: SENDGRID_API_KEY no configurada. Saltando envío de email.")
            return False

        message = Mail(
            from_email=self.sender_email,
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )
        try:
            response = self.sg.send(message)
            print(f"Email enviado a {to_email}, status: {response.status_code}")
            return response.status_code in [200, 202]
        except Exception as e:
            print(f"Error enviando email a {to_email}: {e}")
            return False

    def send_whatsapp(self, to_number: str, message_body: str):
        """Envia un mensaje de WhatsApp a través del microservicio."""
        if not self.whatsapp_service_url:
            print("WARN: WHATSAPP_SERVICE_URL no configurada. Saltando envío de WhatsApp.")
            return False

        try:
            # El número debe incluir el código de país, ej: '54911xxxxxxxx'
            payload = {'to': to_number, 'message': message_body}
            response = requests.post(self.whatsapp_service_url, json=payload, timeout=10)
            response.raise_for_status() # Lanza un error si el status no es 2xx
            print(f"Petición de WhatsApp enviada a {to_number}")
            return True
        except requests.exceptions.RequestException as e:
            print(f"Error enviando WhatsApp a {to_number}: {e}")
            return False
