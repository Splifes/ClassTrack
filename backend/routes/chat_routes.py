"""
Este módulo contiene los endpoints y los manejadores de eventos de Socket.IO
para la funcionalidad de chat.
"""
from flask import Blueprint, jsonify, request
from flask_socketio import emit, join_room, leave_room
from extensions import socketio

chat_bp = Blueprint('chat', __name__, url_prefix='/api/chat')

@chat_bp.route('/history/<conversation_id>', methods=['GET'])
def get_chat_history(conversation_id):
    """Recupera el historial de mensajes para una conversación específica."""
    # Aquí irá la lógica para obtener los mensajes de la base de datos
    # a través de chat_service
    print(f"Fetching history for {conversation_id}")
    # Ejemplo de respuesta
    mock_history = [
        {'id': 1, 'sender': 'user1', 'message': 'Hola!', 'timestamp': '2023-10-27T10:00:00Z'},
        {'id': 2, 'sender': 'user2', 'message': 'Hola, ¿qué tal?', 'timestamp': '2023-10-27T10:01:00Z'},
    ]
    return jsonify(mock_history)

@socketio.on('connect')
def handle_connect():
    """Se ejecuta cuando un cliente se conecta."""
    print(f'Client connected: {request.sid}')

@socketio.on('disconnect')
def handle_disconnect():
    """Se ejecuta cuando un cliente se desconecta."""
    print(f'Client disconnected: {request.sid}')

@socketio.on('join_room')
def handle_join_room(data):
    """Permite a un usuario unirse a una sala de chat (conversación)."""
    room = data.get('room')
    if room:
        join_room(room)
        print(f'Client {request.sid} joined room: {room}')
        # Notificar a la sala que un usuario se ha unido (opcional)
        emit('user_joined', {'user': request.sid, 'room': room}, to=room)

@socketio.on('leave_room')
def handle_leave_room(data):
    """Permite a un usuario abandonar una sala de chat."""
    room = data.get('room')
    if room:
        leave_room(room)
        print(f'Client {request.sid} left room: {room}')
        # Notificar a la sala que un usuario se ha ido (opcional)
        emit('user_left', {'user': request.sid, 'room': room}, to=room)

@socketio.on('send_message')
def handle_send_message(data):
    """Recibe un mensaje de un cliente y lo retransmite a la sala apropiada."""
    room = data.get('room')
    message = data.get('message')
    if room and message:
        print(f'Received message for room {room}: {message}')
        # Aquí se llamaría a chat_service para guardar el mensaje
        # saved_message = chat_service.save_message(...)

        # Retransmitir el mensaje a todos en la sala
        emit('receive_message', data, to=room)
