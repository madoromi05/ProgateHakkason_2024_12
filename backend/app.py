from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import boto3
import os
import uuid

from supabase import create_client, Client

# Flask Setup
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)
"""
# DynamoDB Client
#リージョン東京
dynamodb = boto3.resource('dynamodb', region_name='ap-northeast-1')
#テーブル名Users
table = dynamodb.Table('Users')
"""

# SupabaseのURLとAPIキーを設定
url = "https://oqppbujbkpyfaaxdqqjh.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xcHBidWpia3B5ZmFheGRxcWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1MDQ3NzIsImV4cCI6MjA0OTA4MDc3Mn0.KQyEGSfmykNOKp9T-ihrDTW0wbwN3lTcsemrGEVUdwE"
supabase: Client = create_client(url, key)

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

    # Supabase登録
    try:
        response = supabase.table('Users').insert({
            'username': username,
            'userId': user_id,
            'password': hashed_password
        }).execute()
        if response.status_code == 201:
            return jsonify({'message': 'User registered successfully'}), 201
        else:
            return jsonify({'error': response.error_message}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    """
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
    """

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    # Supabaseからユーザーを取得
    try:
        response = supabase.table('Users').select('*').eq('username', username).execute()
        if not response.data:
            return jsonify({'error': 'User not found'}), 404

        # パスワードを検証
        stored_password = response.data[0]['password']
        user_id = response.data[0]['userId']
        if bcrypt.check_password_hash(stored_password, password):
            return jsonify({'message': 'Login successful'}), 200
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

    try:
        # ファイル名を一意に
        file_ext = file.filename.split('.')[-1]
        unique_filename = f"{uuid.uuid4()}.{file_ext}"
        storage_path = f"photos/{unique_filename}"

        # Supabaseストレージにアップロード
        supabase.storage.from_('uploads').upload(storage_path, file)
        public_url = f"https://oqppbujbkpyfaaxdqqjh.supabase.co/storage/v1/object/public/uploads/{storage_path}"

        # SupabaseのPhotosテーブルに登録
        response = supabase.table('Photos').insert({
            'photoId': str(uuid.uuid4()),
            'userId': user_id,
            'location': location,
            'description': description,
            'imageUrl': public_url
        }).execute()

        if response.status_code == 201:
            return jsonify({'message': 'Photo uploaded successfully', 'imageUrl': public_url}), 201
        else:
            return jsonify({'error': response.error_message}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    """
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
    """
if __name__ == '__main__':
    app.run(debug=True)
