import { createRoot } from "react-dom/client";
import { useState } from "react";
import App from "./App";
import "../src/index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
