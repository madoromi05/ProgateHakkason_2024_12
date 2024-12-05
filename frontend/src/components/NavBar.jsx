import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    return(
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">SNS App</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/profile">Profile</Link>
                </li>
                <li>
                    <Link to="/posts">投稿</Link>
                </li>
                <li>
                    <Link to="/about">アバウト</Link>
                </li>
                <li>
                    <Link to="/contact">お問い合わせ</Link>
                </li>
            </ul>
        </nav>

    )
}

export default NavBar;