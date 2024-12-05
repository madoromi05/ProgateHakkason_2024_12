from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime

# アプリケーションの設定
app = Flask(__name__)
app.secret_key = 'your_secret_key'
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# ユーティリティ関数
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def save_image(file):
    filename = secure_filename(file.filename)
    filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{filename}"
    save_path = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)
    return filename

# 認証関連のルート
@app.route("/")
def hello():
    return redirect(url_for('login'))

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
            user = cursor.fetchone()
            
            if user and check_password_hash(user['password'], password):
                session['user_id'] = user['id']
                session['username'] = user['username']
                return redirect(url_for('timeline'))
            
            flash("ユーザー名またはパスワードが間違っています。")
    
    return render_template('login.html')

@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        try:
            with get_db_connection() as conn:
                cursor = conn.cursor()
                hashed_password = generate_password_hash(password)
                cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)',
                             (username, hashed_password))
                conn.commit()
                return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash("そのユーザー名は既に使用されています。")
    
    return render_template('register.html')

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for('login'))

# メイン機能のルート
@app.route("/timeline")
def timeline():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    with get_db_connection() as conn:
        cursor = conn.cursor()
        # 投稿一覧を取得
        cursor.execute('''
            SELECT 
                posts.*,
                users.username,
                COUNT(DISTINCT likes.id) as like_count,
                COUNT(DISTINCT comments.id) as comment_count,
                EXISTS (
                    SELECT 1 FROM likes 
                    WHERE likes.post_id = posts.id 
                    AND likes.user_id = ?
                ) as user_liked
            FROM posts 
            JOIN users ON posts.user_id = users.id 
            LEFT JOIN likes ON posts.id = likes.post_id
            LEFT JOIN comments ON posts.id = comments.post_id
            GROUP BY posts.id
            ORDER BY posts.created_at DESC
        ''', (session['user_id'],))
        posts = cursor.fetchall()

        # コメントを取得
        post_comments = {}
        for post in posts:
            cursor.execute('''
                SELECT comments.*, users.username
                FROM comments
                JOIN users ON comments.user_id = users.id
                WHERE post_id = ?
                ORDER BY comments.created_at DESC
                LIMIT 3
            ''', (post['id'],))
            post_comments[post['id']] = cursor.fetchall()
        
    return render_template('timeline.html', 
                         posts=posts, 
                         post_comments=post_comments,
                         trending_tags=['#写真好き', '#カメラ', '#風景'])

@app.route("/post", methods=['GET', 'POST'])
def post():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        if 'file' not in request.files:
            flash('ファイルがありません')
            return redirect(request.url)
        
        file = request.files['file']
        if file.filename == '':
            flash('ファイルが選択されていません')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            filename = save_image(file)
            caption = request.form.get('caption', '')
            
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO posts (user_id, image_path, caption)
                    VALUES (?, ?, ?)
                ''', (session['user_id'], filename, caption))
                conn.commit()
            
            return redirect(url_for('timeline'))
    
    return render_template('post.html')

# API エンドポイント
@app.route("/like/<int:post_id>", methods=['POST'])
def like_post(post_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            cursor.execute('INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
                         (session['user_id'], post_id))
            action = 'liked'
        except sqlite3.IntegrityError:
            cursor.execute('DELETE FROM likes WHERE user_id = ? AND post_id = ?',
                         (session['user_id'], post_id))
            action = 'unliked'
        
        cursor.execute('SELECT COUNT(*) FROM likes WHERE post_id = ?', (post_id,))
        like_count = cursor.fetchone()[0]
        conn.commit()
        
    return jsonify({
        'action': action,
        'likeCount': like_count
    })

@app.route("/comment/<int:post_id>", methods=['POST'])
def add_comment(post_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    comment_text = request.form.get('comment')
    if not comment_text:
        return jsonify({'error': 'Comment is required'}), 400

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO comments (user_id, post_id, comment)
            VALUES (?, ?, ?)
        ''', (session['user_id'], post_id, comment_text))
        
        cursor.execute('''
            SELECT comments.*, users.username
            FROM comments
            JOIN users ON comments.user_id = users.id
            WHERE comments.id = last_insert_rowid()
        ''')
        new_comment = cursor.fetchone()
        
        cursor.execute('SELECT COUNT(*) FROM comments WHERE post_id = ?', (post_id,))
        comment_count = cursor.fetchone()[0]
        conn.commit()
        
    return jsonify({
        'success': True,
        'comment': {
            'id': new_comment['id'],
            'username': new_comment['username'],
            'text': new_comment['comment'],
            'created_at': new_comment['created_at']
        },
        'commentCount': comment_count
    })

@app.route("/delete_post/<int:post_id>", methods=['POST'])
def delete_post(post_id):
    if 'user_id' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT user_id, image_path FROM posts WHERE id = ?', (post_id,))
        post = cursor.fetchone()
        
        if not post or post['user_id'] != session['user_id']:
            return jsonify({'error': 'Forbidden'}), 403
        
        image_path = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], post['image_path'])
        if os.path.exists(image_path):
            os.remove(image_path)
            
        cursor.execute('DELETE FROM likes WHERE post_id = ?', (post_id,))
        cursor.execute('DELETE FROM comments WHERE post_id = ?', (post_id,))
        cursor.execute('DELETE FROM posts WHERE id = ?', (post_id,))
        conn.commit()
        
    return jsonify({'success': True})

# ... 既存のコード ...

@app.route("/profile/<username>")
def profile(username):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    with get_db_connection() as conn:
        cursor = conn.cursor()
        # ユーザー情報を取得
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()

        if not user:
            flash("ユーザーが見つかりません。")
            return redirect(url_for('timeline'))

        # ユーザーの投稿を取得
        cursor.execute('''
            SELECT posts.*, COUNT(DISTINCT likes.id) as like_count, COUNT(DISTINCT comments.id) as comment_count
            FROM posts
            LEFT JOIN likes ON posts.id = likes.post_id
            LEFT JOIN comments ON posts.id = comments.post_id
            WHERE posts.user_id = ?
            GROUP BY posts.id
            ORDER BY posts.created_at DESC
        ''', (user['id'],))
        user_posts = cursor.fetchall()

    return render_template('profile.html', user=user, posts=user_posts)

# ... 既存のコード ...

# データベース初期化
def init_db():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # テーブル作成
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                image_path TEXT NOT NULL,
                caption TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS likes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                post_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (post_id) REFERENCES posts (id),
                UNIQUE(user_id, post_id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS comments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                post_id INTEGER NOT NULL,
                comment TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (post_id) REFERENCES posts (id)
            )
        ''')
        
        # テストユーザーの作成
        try:
            test_password = generate_password_hash('password')
            cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)',
                         ('user', test_password))
            conn.commit()
        except sqlite3.IntegrityError:
            pass

def cleanup_missing_images():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT id, image_path FROM posts')
        posts = cursor.fetchall()
        
        for post in posts:
            full_path = os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], post['image_path'])
            if not os.path.exists(full_path):
                cursor.execute('DELETE FROM posts WHERE id = ?', (post['id'],))
        conn.commit()

if __name__ == '__main__':
    init_db()
    cleanup_missing_images()
    app.run(debug=True)