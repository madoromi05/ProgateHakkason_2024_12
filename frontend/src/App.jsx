import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Timeline from './timeline';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import NewPostPage from './components/NewPostPage';
import AllPosts from './components/AllPosts';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { UserProvider } from './UserContext';
import './App.css';

function App() {
  return (
    <UserProvider>
      <div className="app-container">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Timeline />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/posts/new" element={<NewPostPage />} />
            <Route path="/posts/:username" element={<AllPosts />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
          </Routes>
        </main>
      </div>
    </UserProvider>
  );
}

export default App;