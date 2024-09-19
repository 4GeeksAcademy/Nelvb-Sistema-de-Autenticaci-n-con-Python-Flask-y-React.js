"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User
from api.utils import create_jwt_token, verify_jwt_token
from flask_cors import CORS


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)



# Implementar la ruta /signup para el registro de usuarios:

@api.route('/signup', methods=['POST'])
def signup():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    if not email or not password:

        return jsonify({'msg': 'Faltan datos'}), 400

    # Verificar si el usuario ya existe
    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'El usuario ya existe'}), 400

    # Crear el nuevo usuario
    new_user = User(email=email)
    new_user.set_password(password )# Utilizamos el método que genera el hash de la contraseña
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'Usuario registrado con éxito'}), 201

# Implementar la ruta /login para iniciar sesión:

@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get('email')
    password = body.get('password')

    if not email or not password:
        return jsonify({'msg': 'Credenciales inválidas'}), 401
    
    # Verificar si el usuario existe en la base de datos
    user = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return jsonify({'msg': 'Credenciales inválidas'}), 401
    
    # Generar un JWT o token para la sesión
    token = create_jwt_token(user.id)

    return jsonify({'token': token}), 200

# Ruta para validar un token JWT
@api.route('/api/validate-token', methods=['GET'])
def validate_token():
    authorization_header = request.headers.get('Authorization')
    if authorization_header is None:
        return jsonify({
            'msg': 'token no encontrado'
        }), 401
    
    token = authorization_header.split(' ')[1]
    authenticated_user_id = verify_jwt_token(token)

    if authenticated_user_id is None:                                          
        return jsonify({'msg': 'Token no válido o expirado'}), 401
   
    user = User.query.get(authenticated_user_id)
    if user is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 401
    
    return jsonify({'msg': 'Token válido'}), 200
