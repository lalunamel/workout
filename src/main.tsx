import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { StrictMode } from "react";
import AppLayout from "./pages/_app";
import Workouts from "./pages/workouts";
import Graphs from "./pages/graphs";
import Settings from "./pages/settings";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/workouts" replace />}></Route>
        <Route element={<AppLayout />}>
          <Route path="workouts" element={<Workouts />}></Route>
          <Route path="graphs" element={<Graphs />}></Route>
          <Route path="settings" element={<Settings />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
