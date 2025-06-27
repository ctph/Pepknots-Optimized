import React from "react";
import { useNavigate } from "react-router-dom";
import "../../Desktop/DesktopHomePage.css"; 

export default function TitleBar({ title = "Pepknot-917 Database" }) {
  const navigate = useNavigate();

  return (
    <div
      className="home-title"
      onClick={() => navigate("/")}
      style={{ marginTop:"32", fontSize: "2rem", fontWeight: "bold", padding: "16px 24px", cursor: "pointer" }}
    >
      {title}
    </div>
  );
}
