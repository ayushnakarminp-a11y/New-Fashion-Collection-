import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

document.documentElement.classList.add("js");

const root = createRoot(document.getElementById("root")!);

if (window.location.pathname.endsWith("/admin.html")) {
  const { AdminApp } = await import("./admin/AdminApp");
  root.render(<StrictMode><AdminApp /></StrictMode>);
} else {
  const { App } = await import("./App");
  root.render(<StrictMode><App /></StrictMode>);
}
