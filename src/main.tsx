import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Provider from "./components/Provider.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider>
        <div className="w-full">
          <App />
        </div>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
