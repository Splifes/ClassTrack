import React, { useEffect, useState } from 'react';
import { chatService } from '../../services/chatService';
import { ContactList, ChatWindow, MessageInput } from './components';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>('general'); // Ejemplo

  useEffect(() => {
    // Conectar al servidor de chat
    chatService.connect();

    // Suscribirse a nuevos mensajes
    const handleNewMessage = (message: any) => {
      // Solo añadir el mensaje si pertenece a la conversación activa
      if (message.room === selectedConversation) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    chatService.onMessageReceived(handleNewMessage);

    // Unirse a una sala de chat de ejemplo
    chatService.joinRoom(selectedConversation);

    // Desconectar y limpiar al desmontar el componente
    return () => {
      chatService.leaveRoom(selectedConversation);
      chatService.offMessageReceived(handleNewMessage); // Importante para evitar fugas de memoria
      chatService.disconnect();
    };
  }, [selectedConversation]); // Volver a ejecutar si la conversación cambia

  const handleSendMessage = (messageText: string) => {
    const message = {
      room: selectedConversation,
      message: messageText,
      user: { name: 'Yo' }, // Reemplazar con datos reales del usuario
    };
    chatService.sendMessage(message.room, message.message, message.user);
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
      <ContactList />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatWindow messages={messages} />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatPage;
