<<<<<<< HEAD
import React from 'react'; // React を明示的にインポート
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
=======
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import LoginForm from './components/LoginForm.jsx';
import RegisterForm from './components/RegisterForm.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <App />
      {/*<LoginForm />コメントアウト消すとログイン画面が出る*/} 
      {/* <RegisterForm /> */}
    </Router>
  </React.StrictMode>
);
>>>>>>> shoma_front
