from flask import Blueprint, request, jsonify, session
from services.notification_service import NotificationService
from extensions import db
from models import UserPreferences
from routes.decorators import auth_required
import random
from datetime import datetime, timedelta

notification_bp = Blueprint('notification_bp', __name__)

@notification_bp.route('/api/notifications/whatsapp/send-verification', methods=['POST'])
@auth_required
def send_whatsapp_verification():
    user_info = session.get('user')
    if not user_info:
        return jsonify({"error": "User not authenticated"}), 401

    data = request.get_json()
    phone_number = data.get('phone_number')
    if not phone_number:
        return jsonify({"error": "Phone number is required"}), 400

    # Generar código de 6 dígitos
    verification_code = str(random.randint(100000, 999999))

    # Guardar en la base de datos
    user_prefs = UserPreferences.query.filter_by(user_id=user_info['id']).first()
    if not user_prefs:
        user_prefs = UserPreferences(user_id=user_info['id'])
        db.session.add(user_prefs)
    
    user_prefs.whatsapp_number = phone_number
    user_prefs.whatsapp_verification_code = verification_code
    user_prefs.whatsapp_verification_sent_at = datetime.utcnow()
    user_prefs.whatsapp_number_verified = False
    db.session.commit()

    # Enviar código vía WhatsApp
    notification_service = NotificationService()
    message = f"Tu código de verificación para ClassTrack es: {verification_code}"
    success = notification_service.send_whatsapp(phone_number, message)

    if success:
        return jsonify({"message": "Verification code sent successfully."}), 200
    else:
        return jsonify({"error": "Failed to send verification code."}), 500

@notification_bp.route('/api/notifications/whatsapp/verify-code', methods=['POST'])
@auth_required
def verify_whatsapp_code():
    user_info = session.get('user')
    if not user_info:
        return jsonify({"error": "User not authenticated"}), 401

    data = request.get_json()
    code = data.get('code')
    if not code:
        return jsonify({"error": "Verification code is required"}), 400

    user_prefs = UserPreferences.query.filter_by(user_id=user_info['id']).first()

    # Validar código
    if not user_prefs or user_prefs.whatsapp_verification_code != code:
        return jsonify({"error": "Invalid verification code"}), 400

    # Validar expiración (ej: 10 minutos)
    if user_prefs.whatsapp_verification_sent_at < datetime.utcnow() - timedelta(minutes=10):
        return jsonify({"error": "Verification code expired"}), 400

    user_prefs.whatsapp_number_verified = True
    user_prefs.whatsapp_verification_code = None # Limpiar código después de usarlo
    db.session.commit()

    return jsonify({"message": "WhatsApp number verified successfully."}), 200
