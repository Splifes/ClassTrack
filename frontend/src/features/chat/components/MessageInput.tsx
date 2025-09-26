import React, { useState } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc' }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ flex: 1, padding: '10px' }}
        placeholder="Escribe un mensaje..."
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend} style={{ padding: '10px' }}>
        Enviar
      </button>
    </div>
  );
};

export default MessageInput;
