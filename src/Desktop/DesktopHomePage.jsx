import React from 'react';
import './DesktopHomePage.css';
import SearchBar from '../Shared/components/SearchBar';
import PdbTable from '../Shared/components/HomePdbTable';
import { useNavigate } from 'react-router-dom';

const DesktopHomePage = ({ allOptions }) => {
  const navigate = useNavigate();
  
  const handleSearch = (query) => {
    console.log('User searched for:', query);
  };

  // Example if you need to handle navigation here
  const handlePdbClick = (pdbId) => {
    navigate(`/viewer/${pdbId}`);
  };

  return (
    <div className="home-container">
      <h1 className="home-title">PepKnot-917 database</h1>
      <SearchBar allOptions={allOptions} />
      <div style={{ marginTop: 32 }}>
        <PdbTable onPdbClick={handlePdbClick} />
      </div>
    </div>
  );
};

export default DesktopHomePage;