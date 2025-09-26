# Arquitectura de Notificaciones Automáticas

**Autor:** Cascade
**Fecha:** 2025-09-25
**Estado:** Propuesta (v2 - con WhatsApp)

## 1. Objetivo

Implementar un sistema de notificaciones automáticas y externas para informar a los usuarios sobre eventos relevantes en Google Classroom. Los canales de notificación serán **Email** y **WhatsApp**.

**Eventos a notificar (MVP inicial):**
-   **Nueva Tarea Publicada:** Notificar al alumno cuando un profesor publica una nueva `courseWork`.
-   **Recordatorio de Entrega Próxima:** Notificar 24 horas antes de la `dueDate` de una tarea.

## 2. Arquitectura General

La solución se basará en una **arquitectura de microservicios**. El backend principal (Python/Flask) se encargará de la lógica de negocio, mientras que un nuevo microservicio (Node.js) gestionará exclusivamente la conexión con WhatsApp.

### Componentes Clave:

1.  **Scheduler (Backend Python):** Un planificador de tareas (`APScheduler`) que ejecutará un trabajo periódicamente.
2.  **Notification Worker (Backend Python):** Lógica que detecta qué notificaciones deben enviarse.
3.  **Notification Service (Backend Python):** Servicio (`notification_service.py`) que orquesta el envío. Se comunicará con SendGrid para emails y hará una petición HTTP al microservicio de WhatsApp.
4.  **Microservicio de WhatsApp (Node.js):** Un nuevo servicio independiente que utiliza `baileys` para mantener una conexión persistente con WhatsApp y expone un endpoint para enviar mensajes.
5.  **Base de Datos de Tracking (Backend):** Tabla para registrar notificaciones enviadas y evitar duplicados.
6.  **User Preferences UI (Frontend):** Página donde el usuario puede activar/desactivar notificaciones, elegir el canal (Email/WhatsApp) e introducir su número de teléfono.
7.  **User Preferences API (Backend Python):** Endpoints para gestionar las preferencias del usuario.

---

## 3. Implementación Detallada (Backend Python)

### Paso 3.1: Actualizar el Servicio de Notificaciones

El `NotificationService` será modificado para soportar múltiples canales.

-   **Ubicación:** `backend/services/notification_service.py`

```python
# backend/services/notification_service.py
import os
import requests
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

class NotificationService:
    def __init__(self):
        self.sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        self.sender_email = 'noreply@classtrack.app'
        self.whatsapp_service_url = os.environ.get('WHATSAPP_SERVICE_URL', 'http://localhost:3001/send')

    def send_email(self, to_email: str, subject: str, html_content: str):
        # ... (lógica existente) ...

    def send_whatsapp(self, to_number: str, message_body: str):
        if not self.whatsapp_service_url:
            print("WARN: WHATSAPP_SERVICE_URL no configurada. Saltando envío de WhatsApp.")
            return

        try:
            # El número debe incluir el código de país, ej: '54911xxxxxxxx'
            payload = {'to': to_number, 'message': message_body}
            response = requests.post(self.whatsapp_service_url, json=payload, timeout=10)
            response.raise_for_status() # Lanza un error si el status no es 2xx
            print(f"Mensaje de WhatsApp enviado a {to_number}")
        except requests.exceptions.RequestException as e:
            print(f"Error enviando WhatsApp a {to_number}: {e}")
```

El resto de la implementación del backend de Python (Worker, Scheduler) sigue siendo la misma que en la v1 del plan.

---

## 4. Implementación Detallada (Microservicio de WhatsApp - Node.js)

Este será un proyecto nuevo en un directorio separado, por ejemplo `whatsapp-service/`.

### Paso 4.1: Inicializar el Proyecto Node.js

```bash
npm init -y
npm install express @whiskeysockets/baileys pino
# Crear un archivo index.js
```

### Paso 4.2: Lógica del Servicio con `baileys`

El servicio creará una instancia de `baileys`, manejará la autenticación (guardando la sesión en un archivo) y expondrá un endpoint con `express` para recibir solicitudes de envío.

```javascript
// whatsapp-service/index.js
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const pino = require('pino');

const app = express();
app.use(express.json());

let sock;

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
            console.log('QR Code generado. Por favor, escanéalo con tu teléfono.');
            // Aquí podrías exponer el QR a través de un endpoint si fuera necesario
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Conexión cerrada, reconectando:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        }
        else if (connection === 'open') {
            console.log('Conexión con WhatsApp abierta.');
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

// Endpoint para enviar mensajes
app.post('/send', async (req, res) => {
    const { to, message } = req.body;
    if (!to || !message) {
        return res.status(400).json({ error: 'Faltan los parámetros `to` o `message`' });
    }

    try {
        // Formatear el número para Baileys (ej: 54911xxxxxxxx@s.whatsapp.net)
        const jid = `${to}@s.whatsapp.net`;
        await sock.sendMessage(jid, { text: message });
        res.status(200).json({ success: true, message: 'Mensaje enviado.' });
    } catch (e) {
        console.error('Error al enviar mensaje:', e);
        res.status(500).json({ error: 'No se pudo enviar el mensaje.' });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Servicio de WhatsApp escuchando en el puerto ${port}`);
    connectToWhatsApp();
});
```

---

## 5. Implementación Detallada (Frontend)

### Paso 5.1: Actualizar la UI de Preferencias

El componente `NotificationsSettings.tsx` debe ser actualizado para incluir la opción de WhatsApp y un campo para el número de teléfono.

```tsx
// frontend/src/features/settings/NotificationsSettings.tsx
// ... (imports)

export function NotificationsSettings() {
  const [prefs, setPrefs] = useState({
    emailEnabled: true,
    whatsappEnabled: false,
    whatsappNumber: ''
  });

  // ... (lógica para cargar y guardar preferencias) ...

  return (
    <div className="card">
      <h5 className="card-header">Preferencias de Notificación</h5>
      <div className="card-body">
        {/* ... (opción de email) ... */}
        <hr />
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" checked={prefs.whatsappEnabled} onChange={() => { /* ... */ }} />
          <label className="form-check-label">Recibir notificaciones por WhatsApp</label>
        </div>
        {prefs.whatsappEnabled && (
          <div className="mt-2">
            <label className="form-label">Número de WhatsApp</label>
            <input 
              type="tel" 
              className="form-control"
              placeholder="Ej: 5491122334455"
              value={prefs.whatsappNumber}
              onChange={(e) => { /* ... */ }}
            />
            <div className="form-text">Incluye el código de país, sin el símbolo `+`.</div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## 6. Plan de Implementación por Fases

Esta sección detalla el orden recomendado para construir la funcionalidad de notificaciones.

### Fase 1: Configuración y Backend Core

*Objetivo: Tener la base del backend lista, incluyendo la persistencia y los servicios de envío.* 

1.  **[Infraestructura] Decidir e Implementar la Base de Datos:**
    -   **Tarea:** Elegir una solución de base de datos. Para desarrollo local, **SQLite** es la opción más rápida y no requiere un servidor separado.
    -   **Acción:** Añadir la configuración de SQLAlchemy o un ORM similar a la aplicación Flask. Crear los modelos para `UserPreferences` y `SentNotifications`.

2.  **[Backend] Instalar Dependencias de Python:**
    -   **Tarea:** Añadir `APScheduler`, `sendgrid`, y el driver de la base de datos (ej: `psycopg2-binary` para PostgreSQL) al `requirements.txt`.
    -   **Acción:** `pip install -r requirements.txt`

3.  **[Backend] Implementar el `NotificationService`:**
    -   **Tarea:** Crear el archivo `backend/services/notification_service.py` con la clase `NotificationService`.
    -   **Acción:** Implementar los métodos `send_email` y `send_whatsapp` como se describe en la sección 3.1. Añadir las variables de entorno `SENDGRID_API_KEY` y `WHATSAPP_SERVICE_URL` al `.env.example`.

### Fase 2: Microservicio de WhatsApp

*Objetivo: Tener un servicio de WhatsApp funcional y autónomo, listo para recibir peticiones.* 

1.  **[Node.js] Crear la Estructura del Proyecto:**
    -   **Tarea:** Crear un nuevo directorio `whatsapp-service` en la raíz del proyecto.
    -   **Acción:** Dentro de ese directorio, ejecutar `npm init -y` y crear un archivo `index.js`.

2.  **[Node.js] Instalar Dependencias:**
    -   **Tarea:** Instalar las librerías necesarias para el microservicio.
    -   **Acción:** `npm install express @whiskeysockets/baileys pino`

3.  **[Node.js] Implementar el Servicio:**
    -   **Tarea:** Copiar el código de ejemplo de la sección 4.2 en `whatsapp-service/index.js`.
    -   **Acción:** Ejecutar `node index.js` por primera vez. Esto generará un **código QR** en la consola. Escanearlo con un teléfono dedicado para las notificaciones. La sesión se guardará en la carpeta `auth_info_baileys`.

4.  **[Pruebas] Verificar el Endpoint:**
    -   **Tarea:** Con el servicio Node.js corriendo, enviar una petición de prueba para confirmar que funciona.
    -   **Acción:** Usar una herramienta como `curl` o Postman para enviar un POST a `http://localhost:3001/send` con `{"to": "TUNUMERO", "message": "Hola desde ClassTrack!"}`.

### Fase 3: Lógica del Negocio y Frontend

*Objetivo: Conectar todas las piezas. El backend debe poder usar los servicios, y el frontend debe permitir la configuración.* 

1.  **[Backend] Implementar los Endpoints de Preferencias:**
    -   **Tarea:** Crear un nuevo archivo de rutas `backend/routes/user_routes.py` (si no existe).
    -   **Acción:** Implementar los endpoints `GET` y `PUT` para `/api/users/me/notification-preferences`. Estos endpoints leerán y escribirán en la tabla `UserPreferences`.

2.  **[Frontend] Crear la Página de Configuración:**
    -   **Tarea:** Crear el componente `frontend/src/features/settings/NotificationsSettings.tsx`.
    -   **Acción:** Implementar la UI como se describe en la sección 5.1. Conectar los `onChange` de los inputs a funciones que llamen a los nuevos endpoints de la API para guardar las preferencias en tiempo real o con un botón de "Guardar".

3.  **[Backend] Implementar el Worker y el Scheduler:**
    -   **Tarea:** Crear `backend/workers/notification_worker.py` y añadir la configuración de `APScheduler` a `backend/app.py`.
    -   **Acción:** Implementar la lógica dentro de `check_for_new_assignments` y `check_for_upcoming_deadlines`. Esta lógica deberá:
        1.  Consultar la tabla `UserPreferences` para encontrar usuarios que deseen notificaciones.
        2.  Llamar al `GoogleClassroomService` para obtener datos.
        3.  Verificar en `SentNotifications` para evitar duplicados.
        4.  Llamar a `notification_service.send_email()` o `notification_service.send_whatsapp()` según la preferencia del usuario.
        5.  Insertar un registro en `SentNotifications` después de un envío exitoso.

### Fase 4: Despliegue y Finalización

*Objetivo: Preparar la aplicación para producción.* 

1.  **[Infraestructura] Dockerizar la Aplicación:**
    -   **Tarea:** Crear un `Dockerfile` para el backend de Python y otro para el microservicio de Node.js.
    -   **Acción:** Crear un archivo `docker-compose.yml` en la raíz del proyecto que defina los dos servicios (backend, whatsapp-service) y, opcionalmente, la base de datos (ej: PostgreSQL).

2.  **[Pruebas] Pruebas E2E (End-to-End):**
    -   **Tarea:** Realizar una prueba completa del flujo: configurar preferencias en el frontend, esperar a que el scheduler se ejecute (o forzar su ejecución) y verificar que la notificación llegue al canal correcto (Email/WhatsApp).
