from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_cors import CORS
from flask_migrate import Migrate
from extensions import socketio, db
from dotenv import load_dotenv
import models # Importar el módulo completo
import os

# Load .env if present
load_dotenv()


def create_app() -> Flask:
    app = Flask(__name__)

    # Add ProxyFix middleware to handle headers from proxies correctly
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

    # Config
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
    app.config['FRONTEND_URL'] = os.getenv('FRONTEND_URL', 'http://localhost:5173')

    # Session cookie settings for cross-origin requests
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True

    # Configure CORS for the entire app, allowing credentials
    # In development, allow multiple common ports for flexibility
    dev_origins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
    ]
    prod_origin = app.config.get('FRONTEND_URL')
    if prod_origin and prod_origin not in dev_origins:
        dev_origins.append(prod_origin)


    # Initialize SocketIO, it will use the app's CORS settings
    socketio.init_app(app)

    # Database setup
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///classtrack.db')
    db.init_app(app)
    migrate = Migrate(app, db, render_as_batch=True) # render_as_batch=True es una buena práctica para SQLite

    # Register blueprints
    from routes import auth as auth_bp
    from routes.api import api_bp
    from routes.chat_routes import chat_bp
    from routes.notification_routes import notification_bp
    from routes.dashboard_routes import dashboard_bp
    from routes.attendance_routes import attendance_bp
    from routes.courses import courses_bp

    app.register_blueprint(auth_bp.bp)
    app.register_blueprint(api_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(notification_bp)
    print("DEBUG: Registering dashboard_bp...")
    app.register_blueprint(dashboard_bp)
    print("DEBUG: dashboard_bp registered successfully!")
    app.register_blueprint(attendance_bp)
    print("DEBUG: Registering courses_bp...")
    app.register_blueprint(courses_bp, url_prefix='/api')
    print("DEBUG: courses_bp registered successfully!")

    # Importar los manejadores de eventos de chat para que se registren
    from routes import chat_routes # noqa

    # Envolver la app en CORS al final para asegurar que se ejecute primero
    CORS(app, origins=dev_origins, supports_credentials=True)

    return app

app = create_app()

if __name__ == '__main__':

    port = int(os.getenv('PORT', '5001'))
    # Use socketio.run() to enable WebSocket support
    # Using eventlet as the async mode for production readiness
    socketio.run(app, host='0.0.0.0', port=port, debug=True)
