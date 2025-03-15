// Import custom CSS instead of Bootstrap
import './bootstrap-custom.css';

import React from "react";
import ReactDOM from "react-dom/client";  // Ensure correct import for React 18
import App from "./App";  // Ensure App import is at the top

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
