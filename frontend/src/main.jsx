import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { BrowserRouter } from "react-router";
import { LoadingProvider } from "./context/LoadingContext.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import { BookingProvider } from "./context/BookingContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <LoadingProvider>
    <BookingProvider>
      <UserProvider>
        <DataProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </DataProvider>
      </UserProvider>
    </BookingProvider>
  </LoadingProvider>
);
