"""
Este módulo centraliza la inicialización de extensiones de Flask para evitar importaciones circulares.
"""
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

# Inicializar la extensión de SocketIO
socketio = SocketIO()

# Inicializar la extensión de la base de datos
db = SQLAlchemy()
