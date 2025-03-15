import React from "react";
import ReactDOM from "react-dom/client";  // Ensure correct import for React 18
import "bootstrap/dist/css/bootstrap.min.css";  // This should be before App import
import App from "./App";  // Ensure App import is at the top

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
