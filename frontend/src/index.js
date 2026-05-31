import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Spinner from "./components/common/Spinner";

// Select the DOM mounting landing node element safely
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error(
    'Fatal System Mount Exception: DOM node element container binding with ID "#root" could not be located.',
  );
}

const root = ReactDOM.createRoot(rootElement);

// Render clean, optimized context tree (QueryProvider and AuthProvider cascade inside App)
root.render(
  <React.StrictMode>
    <Suspense fallback={<Spinner />}>
      <App />
    </Suspense>
  </React.StrictMode>,
);

