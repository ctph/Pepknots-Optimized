import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "antd";
import TitleBar   from "../Shared/components/TitleBar";
import SearchBar  from "../Shared/components/SearchBar";
import PdbTable   from "../Shared/components/HomePdbTable";
import "./MobileHomePage.css";

const { Title } = Typography;

export default function MobileHomePage({ allOptions }) {
  const navigate = useNavigate();

  const handlePdbClick = pdbId => navigate(`/viewer/${pdbId}`);

  return (
    <>
      {/* Re-use the same clickable banner */}
      <TitleBar />

      <div className="m-home-wrap">
        {/* Subtitle for context
        <Title level={4} className="m-subtitle">
          PepKnot-917 Database
        </Title> */}

        {/* Search bar (prop-drilled options) */}
        <SearchBar allOptions={allOptions} />

        {/* Condensed table; click row to open viewer */}
        <div className="m-table-wrapper">
          <PdbTable onPdbClick={handlePdbClick} />
        </div>
      </div>
    </>
  );
}
