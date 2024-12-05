import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Home from './components/Home';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
//import Posts from './components/Posts';
//import About from './components/About';
//import Contact from './components/Contact';

function App() {
    const [count, setCount] = useState(0);

    const resetCount = () => {
        setCount(0);
    };

    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                {/* <Route path="/posts" element={<Posts />} /> */}
                {/* <Route path="/about" element={<About />} /> */}
                {/* <Route path="/contact" element={<Contact />} /> */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
            </Routes>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount(count + 1)}>
                    count is {count}
                </button>
                <button onClick={resetCount} style={{ marginLeft: '10px' }}>
                    カウントリセット
                </button>
                <p>
                    Edit <code>src/App.jsx</code> and save to test HMR
                </p>
            </div>
            <div className="result_button">
                <a href="/timeline">結果を見る</a>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </Router>
    );
}

export default App;