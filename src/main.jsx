import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AuthProvider from "./context/Auth.jsx";
import ShortBaseURLProvider from "./context/ShortBaseURL.jsx";
import "./assets/styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ShortBaseURLProvider>
        <App />
      </ShortBaseURLProvider>
    </AuthProvider>
  </React.StrictMode>,
);
