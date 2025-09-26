import React, { useState, useEffect } from 'react';
import { api } from '../../services/api'; // Asumimos que api service se actualizará



export const NotificationsSettings: React.FC = () => {
  const [step, setStep] = useState<'enter_number' | 'enter_code' | 'verified'>('enter_number');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // En un futuro, aquí se cargaría el estado de verificación del usuario desde la API
  // useEffect(() => { ... });

  const handleSendCode = async () => {
    if (!phoneNumber.match(/^\d{10,15}$/)) {
      setError('Por favor, introduce un número de teléfono válido (incluyendo código de país, sin +).');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.sendWhatsAppVerification(phoneNumber);
      setStep('enter_code');
    } catch (err) {
      setError('No se pudo enviar el código. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('El código de verificación debe tener 6 dígitos.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.verifyWhatsAppCode(verificationCode);
      setStep('verified');
    } catch (err) {
      setError('Código inválido o expirado. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'enter_number':
        return (
          <div>
            <label htmlFor="phone-number" className="form-label">Tu número de WhatsApp</label>
            <input
              type="tel"
              id="phone-number"
              className="form-control"
              placeholder="Ej: 5491122334455"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={loading}
            />
            <div className="form-text">Incluye el código de país, sin el símbolo `+`.</div>
            <button className="btn btn-primary mt-3" onClick={handleSendCode} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Código de Verificación'}
            </button>
          </div>
        );
      case 'enter_code':
        return (
          <div>
            <label htmlFor="verification-code" className="form-label">Código de Verificación</label>
            <p>Hemos enviado un código a tu WhatsApp ({phoneNumber}).</p>
            <input
              type="text"
              id="verification-code"
              className="form-control"
              maxLength={6}
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={loading}
            />
            <button className="btn btn-primary mt-3" onClick={handleVerifyCode} disabled={loading}>
              {loading ? 'Verificando...' : 'Verificar Número'}
            </button>
            <button className="btn btn-link mt-3" onClick={() => setStep('enter_number')}>Cambiar número</button>
          </div>
        );
      case 'verified':
        return (
          <div className="alert alert-success">
            <h5 className="alert-heading">¡Número Verificado!</h5>
            <p>Tu número de WhatsApp ({phoneNumber}) ha sido vinculado correctamente. Ahora podrás recibir notificaciones y usar comandos.</p>
            <button className="btn btn-outline-danger" onClick={() => setStep('enter_number')}>Desvincular número</button>
          </div>
        );
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5>Notificaciones de WhatsApp</h5>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {renderStep()}
      </div>
    </div>
  );
};
