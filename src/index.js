import React from 'react';
import ReactDOM from 'react-dom';  // ✅ Change this line
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(                      // ✅ Use ReactDOM.render
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
