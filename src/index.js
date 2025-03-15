// Try to import Bootstrap CSS
try {
  require('bootstrap/dist/css/bootstrap.min.css');
} catch (e) {
  console.warn('Bootstrap CSS import failed, using CDN fallback');
}

import React from "react";
import ReactDOM from "react-dom/client";  // Ensure correct import for React 18
import App from "./App";  // Ensure App import is at the top

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
