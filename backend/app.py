from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import boto3
import os
import uuid

# Flask Setup
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

# DynamoDB Client
#リージョン東京
dynamodb = boto3.resource('dynamodb', region_name='ap-northeast-1')
#テーブル名Users
table = dynamodb.Table('Users')

#接続確認用
@app.route('/')
def hello_world():
    return "Hello, World!"

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    user_id = str(uuid.uuid4())

    # パスワードをハッシュ化
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # DynamoDB登録
    try:
        table.put_item(
            Item={
                'username': username,
                 'userId': user_id,
                'password': hashed_password
            }
        )
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    # DynamoDBからユーザーを取得
    try:
        response = table.get_item(Key={'username': username})
        if 'Item' not in response:
            return jsonify({'error': 'User not found'}), 404

        # パスワードを検証
        stored_password = response['Item']['password']
        if bcrypt.check_password_hash(stored_password, password):
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Invalid password'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
