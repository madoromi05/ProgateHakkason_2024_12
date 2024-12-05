import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css'; // スタイルを追加する場合

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
      });
      alert(response.data.message);
      // 登録成功後の処理を追加
    } catch (error) {
      alert(error.response.data.error || 'エラーが発生しました');
    }
  };

  return (
    <div className="register-form-container">
      <h2>ユーザー登録</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">ユーザー名:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">パスワード:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">パスワード確認:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">登録</button>
      </form>
    </div>
  );
}

export default RegisterForm;
