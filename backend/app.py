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
bucket_name = 'remap-posts'

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

      # 都道府県リストのインデックスを取得
        prefectures = [
            "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
            "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
            "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
            "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
            "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
            "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
            "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
        ]
        if location not in prefectures:
            return jsonify({'error': 'Invalid location'}), 400

        location_index = prefectures.index(location)

        # Usersテーブルの `todoufukenn` を更新
        response = table.get_item(Key={'username': user_id})
        if 'Item' not in response:
            return jsonify({'error': 'User not found'}), 404

        user_item = response['Item']
        todoufukenn = user_item.get('todoufukenn', [0] * 47)
        todoufukenn[location_index] += 1

        table.update_item(
            Key={'username': user_id},
            UpdateExpression="SET todoufukenn = :new_list",
            ExpressionAttributeValues={':new_list': todoufukenn}
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

@app.route('/user/<username>/photos', methods=['GET'])
def get_user_photos(username):
    try:
        table_photos = dynamodb.Table('Photos')
        response = table_photos.scan(
            FilterExpression=Key('userId').eq(username)
        )
        photos = response.get('Items', [])
        return jsonify(photos), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/posts/new', methods=['POST'])
def post_photo():
    data = request.json
    username = data.get('username')
    photo_url = data.get('photo_url')
    location = data.get('location')
    description = data.get('description')

    if not all([username, photo_url, location, description]):
        return jsonify({'error': 'Missing fields'}), 400

    try:
        # DynamoDBのPhotosテーブルに投稿を保存
        table_photos = dynamodb.Table('Photos')
        table_photos.put_item(
            Item={
                'photoId': str(uuid.uuid4()),
                'userId': username,
                'location': location,
                'description': description,
                'imageUrl': photo_url,
                'timestamp': int(time.time() * 1000)
            }
        )
        return jsonify({'message': 'Photo posted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
