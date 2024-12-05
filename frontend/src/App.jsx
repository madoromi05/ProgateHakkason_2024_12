import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Home from './components/Home';
import Posts from './components/Posts';
import About from './components/About';
import Contact from './components/Contact';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';



function App() {
    return (
        
        <Router>
            <NavBar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/posts" element={<Posts/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/login" element={<LoginForm/>}/>
                <Route path="/register" element={<RegisterForm/>}/>
            </Routes>
        </Router>
      
    );
}

export default App;