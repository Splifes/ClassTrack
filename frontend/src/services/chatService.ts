import { io, Socket } from 'socket.io-client';

// --- Tipos de Datos ---
export interface ChatMessage {
  room: string;
  message: string;
  user: { name: string }; // Se puede mejorar este tipo más adelante
}

type MessageListener = (message: ChatMessage) => void;

// --- Constantes ---
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// --- Clase del Servicio ---
class ChatService {
  private socket: Socket | null = null;
  private messageListeners: MessageListener[] = [];

  connect() {
    if (this.socket) return; // Evitar conexiones múltiples

    console.log('Connecting to chat server...');
    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server with id:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server.');
    });

    // Escuchar por nuevos mensajes y notificar a los listeners
    this.socket.on('receive_message', (message: ChatMessage) => {
      console.log('New message received:', message);
      this.messageListeners.forEach(listener => listener(message));
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  // --- Sistema de Listeners ---
  onMessageReceived(listener: MessageListener) {
    this.messageListeners.push(listener);
  }

  offMessageReceived(listener: MessageListener) {
    this.messageListeners = this.messageListeners.filter(l => l !== listener);
  }

  // --- Emisión de Eventos ---
  sendMessage(room: string, message: string, user: { name: string }) {
    this.socket?.emit('send_message', { room, message, user });
  }

  joinRoom(room: string) {
    this.socket?.emit('join_room', { room });
  }

  leaveRoom(room: string) {
    this.socket?.emit('leave_room', { room });
  }
}

export const chatService = new ChatService();
