import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './App';
import { Auth0 } from './Auth0';

ReactDOM.render(
  <React.StrictMode>
    <Auth0>
      <App />
    </Auth0>
  </React.StrictMode>,
  document.getElementById('root'),
);
