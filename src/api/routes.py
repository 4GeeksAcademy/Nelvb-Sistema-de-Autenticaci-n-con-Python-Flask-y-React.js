"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200




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