from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import uuid

app = Flask(__name__)
CORS(app)  # フロントエンドとの通信を許可

# DynamoDB クライアントを設定
dynamodb = boto3.resource('dynamodb', region_name='ap-northeast-1')
table = dynamodb.Table('Users')

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.json  # JSONデータを取得
        user_id = str(uuid.uuid4())  # ランダムなUUIDを生成
        name = data.get('name')
        email = data.get('email')

        # データをDynamoDBに保存
        table.put_item(
            Item={
                'id': user_id,
                'name': name,
                'email': email
            }
        )
        return jsonify({'message': 'User registered successfully!', 'user_id': user_id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
