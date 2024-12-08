import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaEdit, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { useUser } from '../UserContext';
import './NavBar.css';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    setUser(null); // ユーザー情報をクリア
    navigate('/login'); // ログインページにリダイレクト
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <Link to="/">ReMap</Link>
      </div>
      <ul className="sidebar-links">
        <li className={isActive('/')}>
          <Link to="/">
            <FaHome className="nav-icon" />
            <span>Home</span>
          </Link>
        </li>
        <li className={isActive('/profile')}>
          <Link to="/profile">
            <FaUser className="nav-icon" />
            <span>Profile</span>
          </Link>
        </li>
        <li className={isActive('/posts/new')}>
          <Link to="/posts/new">
            <FaEdit className="nav-icon" />
            <span>NewPost</span>
          </Link>
        </li>
        {user ? (
          <li>
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt className="nav-icon" />
              <span>Logout</span>
            </button>
          </li>
        ) : (
          <li className={isActive('/login')}>
            <Link to="/login">
              <FaSignInAlt className="nav-icon" />
              <span>Login</span>
            </Link>
          </li>
        )}
      </ul>
      {user && (
        <div className="user-info">
          <span style={{ color: 'red' }}>{user.username}</span>
        </div>
      )}
    </nav>
  );
}

export default NavBar;