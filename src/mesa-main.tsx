import { MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./mesa.css";
import { MesaApp } from "@/MesaApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <MesaApp />
    </MotionConfig>
  </StrictMode>,
);
