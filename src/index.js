import React from 'react';
import ReactDOM from 'react-dom/client'; // React 18 için doğru import
import App from './App'; // App bileşenimizi import ediyoruz

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);