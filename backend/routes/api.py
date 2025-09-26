from flask import Blueprint

# Import individual blueprints
from .courses import courses_bp
from .users import users_bp
from .students import students_bp
from .health import health_bp

# Create a master blueprint for the API
api_bp = Blueprint('api', __name__, url_prefix='/api')

# Register nested blueprints
api_bp.register_blueprint(courses_bp)
api_bp.register_blueprint(users_bp)
api_bp.register_blueprint(students_bp)

# Health check can be registered at the top level or under /api
# For consistency, let's keep it under /api
api_bp.register_blueprint(health_bp)
