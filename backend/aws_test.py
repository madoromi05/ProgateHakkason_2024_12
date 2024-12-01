from flask import Flask, request, jsonify
import boto3
import uuid
from datetime import datetime

app = Flask(__name__)

# DynamoDBクライアントの初期化
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')  # リージョンを指定
table = dynamodb.Table('user')

@app.route('/')
def hello():
    return 'Hello, CORS!'

@app.route('/users', methods=['POST'])
def create_user():
    """新しいユーザーを作成"""
    data = request.json
    user_id = str(uuid.uuid4())  # 一意のIDを生成
    name = data.get('name')
    email = data.get('email')
    created_at = datetime.utcnow().isoformat()

    # DynamoDBにデータを挿入
    table.put_item(Item={
        'user_id': user_id,
        'name': name,
        'email': email,
        'created_at': created_at
    })

    return jsonify({'user_id': user_id, 'message': 'User created successfully'}), 201

@app.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """特定のユーザー情報を取得"""
    response = table.get_item(Key={'user_id': user_id})
    user = response.get('Item')

    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify(user), 200

@app.route('/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """特定のユーザー情報を削除"""
    response = table.delete_item(Key={'user_id': user_id})
    return jsonify({'message': 'User deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
