import React from 'react';
import './DesktopHomePage.css';
import SearchBar from '../Shared/components/SearchBar';
import PdbTable from '../Shared/components/HomePdbTable';


const DesktopHomePage = ({ allOptions }) => {
 const handleSearch = (query) => {
   console.log('User searched for:', query);
 };


 return (
   <div className="home-container">
     <h1 className="home-title">PepKnot-917 database</h1>
     <SearchBar allOptions={allOptions} />
     <div style={{ marginTop: 32 }}>
       <PdbTable />
     </div>
   </div>
 );
};


export default DesktopHomePage;
