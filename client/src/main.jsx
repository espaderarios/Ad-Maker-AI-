import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';
import './utils/responsive';
import { injectGlobalStyles } from './config/globals.js';

injectGlobalStyles();

// Capture unhandled promise rejections and global errors to aid debugging.
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (ev) => {
    // Log full reason and stack when available
    // eslint-disable-next-line no-console
    console.error('Unhandled promise rejection captured:', ev.reason, ev);
  });

  window.addEventListener('error', (ev) => {
    // eslint-disable-next-line no-console
    console.error('Global error captured:', ev.error || ev.message, ev);
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
