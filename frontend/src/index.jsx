import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Timeline from './timeline'; // タイムラインコンポーネントのインポート

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Timeline /> {/* タイムラインを追加 */}
  </React.StrictMode>
);
