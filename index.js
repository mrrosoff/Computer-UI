import React from "react";
import { createRoot } from "react-dom/client";

import "./static/styles/globals.scss";

import App from "./components/App";

createRoot(document.getElementById("root")).render(<App />);
