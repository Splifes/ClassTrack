from flask import Blueprint, jsonify, redirect, request, session, current_app
from services.oauth import GoogleOAuthService
import secrets

bp = Blueprint('auth', __name__)

@bp.get('/api/auth/login')
def auth_login():
    """Initiate OAuth flow with Google"""
    try:
        oauth_service = GoogleOAuthService()
        state = secrets.token_urlsafe(32)
        session['oauth_state'] = state
        
        auth_url = oauth_service.get_auth_url(state=state)
        return redirect(auth_url)
    except ValueError as e:
        return jsonify({
            "error": "OAuth configuration missing",
            "message": str(e),
            "setup_required": True
        }), 500
    except Exception as e:
        return jsonify({
            "error": "OAuth initialization failed",
            "message": str(e)
        }), 500

@bp.get('/oauth/callback')
def oauth_callback():
    """Handle OAuth callback from Google"""
    try:
        # Verify state parameter
        state = request.args.get('state')
        if not state or state != session.get('oauth_state'):
            return jsonify({"error": "Invalid state parameter"}), 400
        
        # Get authorization code
        code = request.args.get('code')
        if not code:
            error = request.args.get('error', 'unknown_error')
            return jsonify({"error": f"OAuth error: {error}"}), 400
        
        # Exchange code for tokens
        oauth_service = GoogleOAuthService()
        tokens = oauth_service.exchange_code_for_tokens(code)
        
        # Get user info
        user_info = oauth_service.get_user_info(tokens['access_token'])
        
        # Store in session
        session['access_token'] = tokens['access_token']
        session['refresh_token'] = tokens.get('refresh_token')
        session['user'] = {
            'id': user_info['id'],
            'email': user_info['email'],
            'name': user_info['name'],
            'picture': user_info.get('picture')
        }
        
        # Clean up state
        session.pop('oauth_state', None)
        
        # Redirect to frontend callback
        frontend_url = current_app.config['FRONTEND_URL']
        return redirect(f"{frontend_url}/auth/callback")
        
    except Exception as e:
        return jsonify({
            "error": "OAuth callback failed",
            "message": str(e)
        }), 500

@bp.get('/api/auth/logout')
def auth_logout():
    """Clear user session"""
    session.clear()
    return jsonify({"message": "Logged out successfully"})
