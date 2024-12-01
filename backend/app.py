from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
import uuid

app = Flask(__name__)
CORS(app)

# AWS DynamoDB のクライアント
dynamodb = boto3.resource('dynamodb', region_name='your-region')  # 例: us-west-2
table = dynamodb.Table('Users')

@app.route('/register', methods=['POST'])
def register_user():
    try:
        data = request.json
        user_id = str(uuid.uuid4())  # 一意のIDを生成
        user_data = {
            'userId': user_id,
            'name': data['name'],
            'email': data['email'],
            'age': data['age']
        }

        # DynamoDB にデータを保存
        table.put_item(Item=user_data)
        return jsonify({'message': 'User registered successfully!', 'userId': user_id}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
