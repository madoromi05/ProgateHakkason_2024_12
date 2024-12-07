from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import boto3
from boto3.session import Session
from boto3.dynamodb.conditions import Key
import os
import uuid


# Flask Setup
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

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
    """
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
