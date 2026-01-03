import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-6gvnuo74z7xubqkk.us.auth0.com"
      clientId="2gTwaJ2EWGLmg1ZooMU9X9C8xecg4EnR"
      authorizationParams={{
        redirect_uri: window.location.origin, // ✅ ALWAYS ROOT
      }}
      cacheLocation="localstorage" // ✅ survives refresh
      useRefreshTokens={true}       // ✅ stable sessions
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
