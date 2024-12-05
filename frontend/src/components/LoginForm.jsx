import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.error || 'An error occurred');
    }
  };

  return (
    <div className="login-form-container">
      <h2>ログイン</h2>
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
        <button type="submit" className="submit-button">ログイン</button>
      </form>
    </div>
  );
};

export default LoginForm;
