from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(300), unique=False, nullable=False)
    first_name = db.Column(db.String(50), unique=False, nullable=False)
    last_name = db.Column(db.String(50), unique=False, nullable=False)

    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f'<User {self.email}>'
    
    # Método para generar el hash de la contraseña
    def set_password(self, password):
        """Genera el hash de la contraseña para almacenarlo"""
        self.password_hash = generate_password_hash(password)

    # Método para verificar si la contraseña proporcionada coincide con el hash almacenado
    def check_password(self, password):
        """Verifica si la contraseña proporcionada es válida"""
        return check_password_hash(self.password_hash, password)

    # Serialización de los datos del usuario (sin la contraseña por seguridad)
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,  # Incluyendo el nombre
            "last_name": self.last_name,    # Incluyendo los apellidos
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            # do not serialize the password, its a security breach
        }
