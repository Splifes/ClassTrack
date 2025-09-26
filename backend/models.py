from extensions import db
from datetime import datetime

class UserPreferences(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), unique=True, nullable=False) # Google User ID

    # Email preferences
    email_enabled = db.Column(db.Boolean, default=True)
    email_new_assignment = db.Column(db.Boolean, default=True)
    email_deadline_reminder = db.Column(db.Boolean, default=True)

    # WhatsApp preferences
    whatsapp_enabled = db.Column(db.Boolean, default=False)
    whatsapp_number = db.Column(db.String(20), nullable=True)
    whatsapp_number_verified = db.Column(db.Boolean, default=False, nullable=False)
    whatsapp_verification_code = db.Column(db.String(6), nullable=True)
    whatsapp_verification_sent_at = db.Column(db.DateTime, nullable=True)
    whatsapp_new_assignment = db.Column(db.Boolean, default=True)
    whatsapp_deadline_reminder = db.Column(db.Boolean, default=True)

    def __repr__(self):
        return f'<UserPreferences {self.user_id}>'

class SentNotification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(80), nullable=False, index=True)
    entity_id = db.Column(db.String(120), nullable=False, index=True) # e.g., courseWorkId
    notification_type = db.Column(db.String(50), nullable=False) # e.g., 'new_assignment' or 'deadline_reminder'
    channel = db.Column(db.String(20), nullable=False) # 'email' or 'whatsapp'
    sent_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (db.UniqueConstraint('user_id', 'entity_id', 'notification_type', 'channel', name='_user_entity_type_channel_uc'),)

    def __repr__(self):
        return f'<SentNotification {self.user_id} - {self.notification_type}>'
