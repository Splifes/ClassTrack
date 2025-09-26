import React from 'react';

interface ChatWindowProps {
  messages: any[]; // Se puede mejorar este tipo más adelante
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {

  return (
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      {messages.length === 0 ? (
        <p className="text-center text-muted">No hay mensajes todavía. ¡Comienza la conversación!</p>
      ) : (
        messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>{msg.user?.name || 'Usuario'}:</strong> {msg.message}
          </div>
        ))
      )}
    </div>
  );
};

export default ChatWindow;
