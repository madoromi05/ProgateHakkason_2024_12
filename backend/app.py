from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import boto3
from boto3.session import Session
from boto3.dynamodb.conditions import Key
from dotenv import load_dotenv
import os
import uuid
from dotenv import load_dotenv
import logging
import time

load_dotenv()

logging.basicConfig(level=logging.DEBUG)

# Flask Setup
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5173", "http://localhost:4173"]}})

# DynamoDB Client
dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-west-2',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=os.getenv('AWS_SESSION_TOKEN')
)
# テーブル名Users
table = dynamodb.Table('Users')

# S3 Client
s3 = boto3.client(
    's3',
    region_name='us-west-2',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    aws_session_token=os.getenv('AWS_SESSION_TOKEN')
)
bucket_name = 'remap-posts'  # ここを実際のバケット名に置き換えてください

# 接続確認用
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

@app.route('/upload-photo', methods=['POST'])
def upload_photo():
    # 環境変数の確認
    print('---------------------')
    print(os.getenv('AWS_ACCESS_KEY_ID'))
    print(os.getenv('AWS_SECRET_ACCESS_KEY'))
    print(os.getenv('AWS_SESSION_TOKEN'))
    print('---------------------')

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

        # S3にファイルをアップロード
        s3.upload_fileobj(file, bucket_name, storage_path)

        # S3の公開URLを取得
        public_url = f"https://{bucket_name}.s3.amazonaws.com/{storage_path}"

        # DynamoDBのPhotosテーブルに登録
        table_photos = dynamodb.Table('Photos')
        table_photos.put_item(
            Item={
                'photoId': str(uuid.uuid4()),
                'userId': user_id,
                'location': location,
                'description': description,
                'imageUrl': public_url,
                'timestamp': int(time.time() * 1000)
            }
        )

        return jsonify({'message': 'Photo uploaded successfully', 'imageUrl': public_url}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/photos', methods=['GET'])
def get_photos():
    try:
        logging.debug("Attempting to scan Photos table")
        table_photos = dynamodb.Table('Photos')
        response = table_photos.scan()
        photos = response.get('Items', [])
        
        # 各写真のS3 URLに署名付きURLを生成
        for photo in photos:
            if 'imageUrl' in photo:
                # S3のオブジェクトキーを取得（URLからパスを抽出）
                object_key = photo['imageUrl'].split('.com/')[-1]
                # 署名付きURLを生成（有効期限1時間）
                signed_url = s3.generate_presigned_url(
                    'get_object',
                    Params={
                        'Bucket': bucket_name,
                        'Key': object_key
                    },
                    ExpiresIn=3600
                )
                photo['imageUrl'] = signed_url
                
        logging.debug(f"Photos retrieved: {photos}")
        return jsonify(photos), 200
    except Exception as e:
        logging.error(f"Error in get_photos: {str(e)}")
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
