import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./context/authContext/index.jsx";
import InstructorProvider from "./context/instructorContext/index.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <InstructorProvider>
        <App />
      </InstructorProvider>
    </AuthProvider>
  </BrowserRouter>
);
