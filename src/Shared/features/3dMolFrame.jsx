import React from "react";
import "./3dMolFrame.css";

export default function MolFrame({
  children,
  height    = "500px",
  minHeight = "300px",
  maxWidth  = "100%",
  style     = {},
}) {
  return (
    <div
      className="mol-frame"
      style={{ height, minHeight, maxWidth, ...style }}
    >
      {children}
    </div>
  );
}
