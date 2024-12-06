import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
{/*<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    {<Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>*/}
import NavBar from './components/NavBar';
import Profile from './components/Profile';
import Home from './components/Home';
import Posts from './components/Posts';
import About from './components/About';
import Contact from './components/Contact';
import LoginForm from './components/LoginFrom';
import RegisterForm from './components/RegisterForm';

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
}

export default App;