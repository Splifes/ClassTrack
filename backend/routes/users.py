from flask import Blueprint, jsonify, session
from .decorators import auth_required

users_bp = Blueprint('users', __name__, url_prefix='/users')

@users_bp.get('/me')
@auth_required
def get_current_user():
    """Get current user info"""
    return jsonify(session['user']), 200
