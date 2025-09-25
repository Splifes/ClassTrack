import os
import requests
from urllib.parse import urlencode
from typing import Dict, Optional

class GoogleOAuthService:
    def __init__(self):
        self.client_id = os.getenv('GOOGLE_CLIENT_ID')
        self.client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
        self.redirect_uri = os.getenv('GOOGLE_REDIRECT_URI')
        
        if not all([self.client_id, self.client_secret, self.redirect_uri]):
            raise ValueError("Missing Google OAuth configuration. Check GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI")
    
    def get_auth_url(self, state: str = None) -> str:
        """Generate Google OAuth authorization URL"""
        params = {
            'client_id': self.client_id,
            'redirect_uri': self.redirect_uri,
            'response_type': 'code',
            'scope': ' '.join([
                'openid',
                'email',
                'profile',
                'https://www.googleapis.com/auth/classroom.courses.readonly',
                'https://www.googleapis.com/auth/classroom.rosters.readonly',
                'https://www.googleapis.com/auth/classroom.student-submissions.students.readonly'
            ]),
            'access_type': 'offline',
            'prompt': 'consent'
        }
        
        if state:
            params['state'] = state
            
        return f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    
    def exchange_code_for_tokens(self, code: str) -> Dict:
        """Exchange authorization code for access and refresh tokens"""
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'code': code,
            'grant_type': 'authorization_code',
            'redirect_uri': self.redirect_uri
        }
        
        response = requests.post('https://oauth2.googleapis.com/token', data=data)
        response.raise_for_status()
        return response.json()
    
    def get_user_info(self, access_token: str) -> Dict:
        """Get user profile information"""
        headers = {'Authorization': f'Bearer {access_token}'}
        response = requests.get('https://www.googleapis.com/oauth2/v2/userinfo', headers=headers)
        response.raise_for_status()
        user_info = response.json()
        
        # Add role detection based on email or other criteria
        user_info['role'] = self._detect_user_role(user_info.get('email', ''))
        return user_info
    
    def _detect_user_role(self, email: str) -> str:
        """Detect user role based on email or other criteria"""
        # Simple heuristic - in production this would check a database or external service
        email_lower = email.lower()
        
        if any(keyword in email_lower for keyword in ['coordinator', 'admin', 'director']):
            return 'coordinator'
        elif any(keyword in email_lower for keyword in ['teacher', 'profesor', 'instructor']):
            return 'teacher'
        else:
            return 'student'
    
    def refresh_access_token(self, refresh_token: str) -> Dict:
        """Refresh access token using refresh token"""
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'refresh_token': refresh_token,
            'grant_type': 'refresh_token'
        }
        
        response = requests.post('https://oauth2.googleapis.com/token', data=data)
        response.raise_for_status()
        return response.json()
