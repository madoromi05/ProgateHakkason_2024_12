import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
{/*<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    {<Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>*/}
=======
import { Routes, Route } from 'react-router-dom';
>>>>>>> shoma_front
import NavBar from './components/NavBar';
import Timeline from './timeline';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import NewPostPage from './components/NewPostPage';
import AllPosts from './components/AllPosts';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
<<<<<<< HEAD

function App() {
    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/profile" element={<Profile/>}/>
                {/*<Route path="/posts" element={<Posts/>}/>*/}
                {/*<Route path="/about" element={<About/>}/>*/}
                {/*<Route path="/contact" element={<Contact/>}/>*/}

            </Routes>
        </Router>
    );
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
        <h1>My App</h1>
          <LoginForm />
          <RegisterForm />
      </div>
      <div className="result_button">
        <a href="./timeline.html">結果を見る</a>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
=======
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
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </main>
    </div>
  );
>>>>>>> shoma_front
}

export default App;