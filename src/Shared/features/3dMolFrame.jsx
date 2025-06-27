// Handle 3dmol feature
import React from "react";
import "./3dMolFrame.css";

/**
 * A simple wrapper that forces its children to fill the viewport.
 * Drop toolbars or overlays inside if you wish.
 */
export default function MolFrame({ children }) {
  return <div className="mol-frame">{children}</div>;
}
