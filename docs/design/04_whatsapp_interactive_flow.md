# Arquitectura: Flujo Interactivo de WhatsApp

**Autor:** Cascade
**Fecha:** 2025-09-25
**Estado:** Propuesta

## 1. Objetivo

Evolucionar la integración de WhatsApp de un simple notificador a una plataforma de comunicación bidireccional. El sistema permitirá a los usuarios verificar su número de teléfono y interactuar con la aplicación a través de comandos de texto, recibiendo respuestas personalizadas.

## 2. Arquitectura General

El sistema se basará en la colaboración entre el Frontend (React), el Backend (Python) y el Microservicio de WhatsApp (Node.js).

-   **Frontend:** Gestiona la interfaz para que el usuario ingrese y verifique su número.
-   **Backend (Python):** Orquesta el flujo de verificación, almacena los datos y procesa la lógica de los comandos del bot.
-   **Microservicio (Node.js):** Actúa como una pasarela (gateway) pura: envía los mensajes que el backend le ordena y reenvía al backend los mensajes que recibe de los usuarios.

### Flujo de Verificación de Número:

1.  **Usuario** introduce su número en el Frontend.
2.  **Frontend** llama a `POST /api/whatsapp/send-verification`.
3.  **Backend (Python)** genera un código, lo guarda en la BD (con estado 'PENDIENTE' y timestamp) y llama al endpoint `/send` del **Microservicio de WhatsApp**.
4.  **Microservicio** envía el código al usuario.
5.  **Usuario** recibe el código y lo introduce en el Frontend.
6.  **Frontend** llama a `POST /api/whatsapp/verify-code`.
7.  **Backend (Python)** comprueba el código. Si es válido, actualiza el estado del número a 'VERIFICADO' en la tabla `UserPreferences`.

### Flujo de Comando de Bot:

1.  **Usuario** envía un mensaje (ej: "MIS TAREAS") al número de WhatsApp del bot.
2.  **Microservicio (Node.js)** recibe el mensaje a través del evento `messages.upsert`.
3.  **Microservicio** reenvía inmediatamente el contenido del mensaje (remitente y texto) a un endpoint `POST /api/whatsapp/webhook` en el **Backend (Python)**.
4.  **Backend (Python)** recibe el webhook, procesa el comando (ej: consulta las tareas del usuario en la BD o vía `GoogleClassroomService`), genera una respuesta y llama al endpoint `/send` del **Microservicio** para enviarla.
5.  **Microservicio** envía la respuesta al usuario.

---

## 3. Cambios y Nuevos Componentes

### 3.1. Base de Datos (Modelo `UserPreferences`)

Se necesita añadir campos para gestionar el proceso de verificación:

```python
# backend/models.py
class UserPreferences(db.Model):
    # ... campos existentes ...
    whatsapp_number_verified = db.Column(db.Boolean, default=False)
    whatsapp_verification_code = db.Column(db.String(6), nullable=True)
    whatsapp_verification_sent_at = db.Column(db.DateTime, nullable=True)
```

### 3.2. Backend (Python)

-   **Nuevos Endpoints:**
    -   `POST /api/notifications/whatsapp/send-verification`: Inicia el flujo de verificación.
    -   `POST /api/notifications/whatsapp/verify-code`: Valida el código introducido por el usuario.
    -   `POST /api/whatsapp/webhook`: Recibe los mensajes entrantes desde el microservicio de Node.js. Debe ser protegido con una clave secreta.
-   **Lógica de Comandos:** Crear un `command_processor.py` que, dado un comando de texto, devuelva la respuesta apropiada.

### 3.3. Microservicio de WhatsApp (Node.js)

-   **Manejador de Mensajes Entrantes:**

```javascript
// en index.js
sock.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0];
    if (!msg.key.fromMe && m.type === 'notify') {
        const sender = msg.key.remoteJid;
        const messageText = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

        if (sender && messageText) {
            // Reenviar al backend de Python
            await fetch(process.env.PYTHON_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Secret': process.env.WEBHOOK_SECRET
                },
                body: JSON.stringify({ from: sender, text: messageText })
            });
        }
    }
});
```

### 3.4. Frontend (React)

-   **Nueva UI de Configuración:**
    -   Un componente en `src/features/settings/` con un formulario para el número de teléfono y el código de verificación.
    -   Lógica de estado para manejar los diferentes pasos del flujo (introducir número, introducir código, verificado).

## 4. Consideraciones de Seguridad

-   El endpoint `/api/whatsapp/webhook` en el backend de Python **DEBE** ser protegido para evitar que cualquiera pueda simular ser el microservicio. Se usará una cabecera `X-Webhook-Secret` con un token secreto compartido entre ambos servicios a través de variables de entorno.
