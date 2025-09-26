import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const WHATSAPP_SERVICE_URL = 'http://localhost:3001'; // Debería estar en .env

const WhatsappAdminPage: React.FC = () => {
  const [status, setStatus] = useState('LOADING');
  const [qr, setQr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const response = await fetch(`${WHATSAPP_SERVICE_URL}/admin/status`);
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data.status);
      setQr(data.qr);
      setError(null);
    } catch (err) {
      setStatus('ERROR');
      setError('Could not connect to the WhatsApp service. Is it running?');
    }
  };

  const handleReconnect = async () => {
    try {
        setStatus('LOADING');
        const response = await fetch(`${WHATSAPP_SERVICE_URL}/admin/reconnect`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to send reconnect command');
        setTimeout(fetchStatus, 2000); // Dar tiempo al servicio para generar un nuevo QR
    } catch (err) {
        setError('Failed to send reconnect command.');
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Consultar estado cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    if (status === 'LOADING') {
      return <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>;
    }
    if (status === 'ERROR') {
        return <div className="alert alert-danger">{error}</div>;
    }
    if (status === 'CONNECTED') {
      return <div className="alert alert-success">✅ Conectado a WhatsApp</div>;
    }
    if (status === 'WAITING_QR' && qr) {
      return (
        <div>
          <h5>Escanea el Código QR</h5>
          <p>Abre WhatsApp en tu teléfono y escanea este código para conectar el bot.</p>
          <div className='p-4 bg-white d-inline-block'>
            <QRCodeSVG value={qr} size={256} />
          </div>
        </div>
      );
    }
    return <div className="alert alert-warning">Estado desconocido: {status}</div>;
  };

  return (
    <div className="container mt-4">
        <div className='d-flex justify-content-between align-items-center mb-3'>
            <h2>Gestión de WhatsApp</h2>
            <button className='btn btn-outline-primary' onClick={handleReconnect}>Forzar Reconexión / Nuevo QR</button>
        </div>
      
      <div className="card">
        <div className="card-body text-center">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default WhatsappAdminPage;
