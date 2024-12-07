from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import boto3
from boto3.session import Session
from boto3.dynamodb.conditions import Key
from dotenv import load_dotenv
import os
import uuid

# Flask Setup
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

# 環境変数でDynamoDBリソースを取得
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Users')

# 環境変数でDynamoDBリソースを取得
"""
load_dotenv()
dynamodb = boto3.resource('dynamodb', 
                          aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                          aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
                          region_name=os.getenv('AWS_REGION'))
table = dynamodb.Table('Users')
"""
#接続確認用
@app.route('/')
def hello_world():
    return "Hello, World!"

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Username and password are required'}), 400

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
                'password': hashed_password,
                'photos':[],
                'prefectures':[],
                #47個
                'todoufukenn':[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            }
        )
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Username and password are required'}), 400
    username = data['username']
    password = data['password']

    try:
        # DynamoDBからユーザーを取得
        response = table.get_item(Key={'username': username})
        
        if 'Item' not in response:
            return jsonify({'error': 'User not found'}), 404

        # パスワードを検証
        stored_password = response['Item']['password']
        
        if bcrypt.check_password_hash(stored_password, password):
            return jsonify({'message': 'Login successful', 'userId': response['Item']['userId']}), 200
        else:
            return jsonify({'error': 'Invalid password'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/upload-photo', methods=['POST'])
def upload_photo():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    location = request.form.get('location')
    description = request.form.get('description')
    user_id = request.form.get('userId')

    if not all([file, location, description, user_id]):
        return jsonify({'error': 'Missing fields'}), 400


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

@app.route('/posts/new',methods=['POST'])
def post_photo():
    data = request.json
    username = data['username']
    photo_url = data['photo_url']
    prefecture = data['prefecture']

    try:
        response = table.update_item(
            Key={'username': username},
            UpdateExpression="SET photos = list_append(if_not_exists(photos, :empty_list), :photo), prefectures = list_append(if_not_exists(prefectures, :empty_list), :prefecture)",
            ExpressionAttributeValues={
                ':photo': [photo_url],
                ':prefecture': [prefecture],
                ':empty_list': []
            },
            ReturnValues="UPDATED_NEW"
        )
        return jsonify({'message': 'Photo posted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
