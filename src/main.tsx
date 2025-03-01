import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

const basename = import.meta.env.BASE_URL;

// Set VITE_TEMPO to true for development
if (import.meta.env.DEV) {
  window.process = window.process || {};
  window.process.env = window.process.env || {};
  window.process.env.VITE_TEMPO = "true";
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
