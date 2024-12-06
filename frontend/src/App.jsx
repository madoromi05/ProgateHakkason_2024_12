import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Timeline from './timeline';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import NewPostPage from './components/NewPostPage';
import AllPosts from './components/AllPosts';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Timeline />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/user/:username" element={<UserProfile />} />
          <Route path="/posts/new" element={<NewPostPage />} />
          <Route path="/posts" element={<AllPosts />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;