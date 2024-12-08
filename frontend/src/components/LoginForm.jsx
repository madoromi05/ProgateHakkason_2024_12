import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import './LoginForm.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      if (response.status === 200) {
        alert(response.data.message);
        setUser({ username });
        navigate('/');
      }
    } catch (error) {
      alert(error.response.data.error || 'An error occurred');
    }
  };

  return (
    <div className="login-form-container">
      <div className="form-content">
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
        <button className="register-button" onClick={() => navigate('/register')}>新規登録</button>
      </div>
    </div>
  );
}

export default LoginForm;
