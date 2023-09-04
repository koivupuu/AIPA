import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './styles.css';
import App from './App';
import reportWebVitals from './reportWebVitals'
import { Auth0Provider } from '@auth0/auth0-react';

const AUTH0_DOMAIN = process.env.REACT_APP_AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.REACT_APP_AUTH0_CLIENT_ID;
const AUTH0_AUDIENCE = process.env.REACT_APP_AUTH0_AUDIENCE;

if (!AUTH0_DOMAIN || !AUTH0_CLIENT_ID) {
  throw new Error("Auth0 environment variables are missing");
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.render(
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId={AUTH0_CLIENT_ID}
    authorizationParams={
      {
        audience: AUTH0_AUDIENCE, 
        redirectUri: window.location.origin
      }
    }
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>,
  rootElement
);

reportWebVitals();
