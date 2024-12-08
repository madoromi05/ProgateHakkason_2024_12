import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaEdit, FaClock , FaSignInAlt} from 'react-icons/fa';
import './NavBar.css';

function NavBar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
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
        <li className={isActive('/login')}>
          <Link to="/login">
            <FaSignInAlt className="nav-icon" />
            <span>Login</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;