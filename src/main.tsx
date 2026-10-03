import React from "react";
import ReactDOM from "react-dom/client";
import App from "./renderer/App";
import { Theme } from "@radix-ui/themes";
import "./renderer/styles/index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Theme hasBackground={false}>
      <App />
    </Theme>
  </React.StrictMode>
);
