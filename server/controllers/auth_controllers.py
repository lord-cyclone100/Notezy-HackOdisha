from flask import request, jsonify
import bcrypt
import jwt
from datetime import datetime, timedelta
from functools import wraps

def token_required(app,f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user_id, *args, **kwargs)
    return decorated

def register(app,users_collection):
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not name or not email or not password:
            return jsonify({"error": "Missing fields"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"message": "Email already exists"}), 409
        
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password.decode('utf-8')
        }

        result = users_collection.insert_one(user_data)
        user_id = str(result.inserted_id)

        # Generate JWT token
        token = jwt.encode({
            'user_id': user_id,
            'email': email,
            'name': name,
            'exp': datetime.utcnow() + timedelta(days=30)  # Token expires in 30 days
        }, app.config['JWT_SECRET_KEY'], algorithm='HS256')

        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": {
                "id": user_id,
                "name": name,
                "email": email
            }
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    


def login(app,users_collection):
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"message": "User does not exist"}), 404

        stored_hash = user["password"].encode('utf-8')
        if not bcrypt.checkpw(password.encode('utf-8'), stored_hash):
            return jsonify({"message": "Incorrect password"}), 401

        # Generate JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'email': user['email'],
            'name': user['name'],
            'exp': datetime.utcnow() + timedelta(days=30)  # Token expires in 30 days
        }, app.config['JWT_SECRET_KEY'], algorithm='HS256')

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": str(user['_id']),
                "name": user['name'],
                "email": user['email']
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def verify_token(app):
    try:
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        
        return jsonify({
            'valid': True,
            'user': {
                'id': data['user_id'],
                'name': data['name'],
                'email': data['email']
            }
        }), 200
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired', 'valid': False}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Token is invalid', 'valid': False}), 401