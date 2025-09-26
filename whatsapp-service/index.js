const express = require('express');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

let sock;
let qrCodeData = null;
let connectionStatus = 'DISCONNECTED';

async function connectToWhatsApp() {
    // Importación dinámica de Baileys
    const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = await import('@whiskeysockets/baileys');

    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if(qr) {
            console.log('Nuevo QR Code recibido.');
            qrCodeData = qr;
            connectionStatus = 'WAITING_QR';
        }
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Conexión cerrada, reconectando:', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        }
        else if (connection === 'open') {
            console.log('Conexión con WhatsApp abierta y lista para enviar mensajes.');
            qrCodeData = null; // Limpiar QR una vez conectado
            connectionStatus = 'CONNECTED';
        }
    });

    sock.ev.on('creds.update', saveCreds);
}

// Endpoints de Administración
app.get('/admin/status', (req, res) => {
    res.status(200).json({ status: connectionStatus, qr: qrCodeData });
});

app.post('/admin/reconnect', async (req, res) => {
    console.log('Recibida petición para forzar reconexión...');
    if (sock) {
        await sock.logout();
    }
    // Eliminar sesión guardada para forzar nuevo QR
    const fs = require('fs').promises;
    await fs.rm('auth_info_baileys', { recursive: true, force: true });
    
    connectToWhatsApp();
    res.status(200).json({ message: 'Proceso de reconexión iniciado.' });
});


// Endpoint de salud para verificar la conexión
app.get('/health', (req, res) => {
    const isConnected = sock && sock.ws.readyState === 1;
    if (isConnected) {
        res.status(200).json({ status: 'CONNECTED', message: 'Servicio conectado a WhatsApp.' });
    } else {
        res.status(503).json({ status: 'DISCONNECTED', message: 'Servicio no conectado a WhatsApp.' });
    }
});

// Endpoint para enviar mensajes
app.post('/send', async (req, res) => {
    const { to, message } = req.body;
    if (!to || !message) {
        return res.status(400).json({ error: 'Faltan los parámetros `to` o `message`' });
    }

    if (!sock || sock.ws.readyState !== 1) {
        return res.status(503).json({ error: 'El servicio de WhatsApp no está conectado. Inténtalo de nuevo en unos momentos.' });
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
