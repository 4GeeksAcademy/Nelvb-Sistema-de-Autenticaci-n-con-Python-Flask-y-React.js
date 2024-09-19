"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
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
    token = create_access_token(identity=user.id)

    return jsonify({'token': token}), 200



# Ruta protegida con JWT, requiere token válido
@api.route('/api/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()  # Recupera el ID del usuario a partir del JWT
    user = User.query.get(current_user_id)

    if user is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
    return jsonify({'id':user.id, 'email': user.email}), 200



# Ruta para validar un token JWT
@api.route('/api/validate-token', methods=['GET'])
@jwt_required()
def validate_token():
    current_user_id = get_jwt_identity()  # Recupera el ID del usuario del JWT
    user = User.query.get(current_user_id)

    if user is None:
        return jsonify({'msg': 'Usuario no encontrado'}), 404

    return jsonify({'msg': 'Token válido', 'user_id': user.id, 'email': user.email}), 200
