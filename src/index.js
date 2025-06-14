import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/App.css';
import ChecklistApp from './ChecklistApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChecklistApp />
  </React.StrictMode>
);
