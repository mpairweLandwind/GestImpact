import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{ redirect_uri: "https://gest-impact-teal.vercel.app" }}
      audience="https://gest-impact.vercel.app"
      scope="openid profile email"
    >
        <I18nextProvider i18n={i18n}>
      <App />
      </I18nextProvider>
    </Auth0Provider>
  </React.StrictMode>
);
