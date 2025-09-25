from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load .env if present
load_dotenv()

def create_app() -> Flask:
    app = Flask(__name__)

    # Config
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret')
    app.config['FRONTEND_URL'] = os.getenv('FRONTEND_URL', 'http://localhost:5173')

    # CORS for frontend origin, allow cookies if needed in the future
    CORS(app, resources={r"/*": {"origins": [app.config['FRONTEND_URL']] }}, supports_credentials=True)

    # Register blueprints
    from routes import auth as auth_bp
    from routes import api as api_bp
    app.register_blueprint(api_bp.bp)
    app.register_blueprint(auth_bp.bp)

    return app

app = create_app()

if __name__ == '__main__':
    port = int(os.getenv('PORT', '5001'))
    app.run(host='0.0.0.0', port=port, debug=True)
