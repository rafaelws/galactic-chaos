import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { Main } from "./Main";

const root = document.querySelector<HTMLElement>("#root")!;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
