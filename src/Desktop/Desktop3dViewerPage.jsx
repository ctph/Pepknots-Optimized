// import React, { useEffect, useRef, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';

// const Desktop3dViewerPage = () => {
//   const { pdbId: rawParam } = useParams();
//   const navigate = useNavigate();
//   const viewerRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [fullPdbId, setFullPdbId] = useState('');

//   // Extract and validate PDB ID with chain
//   useEffect(() => {
//     if (!rawParam) {
//       setError('No PDB ID provided in URL');
//       setLoading(false);
//       return;
//     }

//     // Extract and validate PDB ID with chain (e.g., "1ABT_B")
//     const parts = rawParam.split('_');
//     if (parts.length < 2 || !parts[0] || !parts[1]) {
//       setError(`Invalid PDB ID format. Expected format like "1ABT_B"`);
//       setLoading(false);
//       return;
//     }

//     const baseId = parts[0].toUpperCase();
//     const chainId = parts[1].toUpperCase();
//     const fullId = `${baseId}_${chainId}`;
    
//     setFullPdbId(fullId);
//   }, [rawParam]);

//   // Initialize viewer
//   useEffect(() => {
//     if (!fullPdbId) return;

//     const initViewer = async () => {
//       try {
//         // Load 3DMol if needed
//         if (typeof window.$3Dmol === 'undefined') {
//           await loadScript('https://3Dmol.org/build/3Dmol-min.js');
//           await waitFor3DMol();
//         }

//         // Verify WebGL
//         if (!window.$3Dmol?.GLViewer?.isWebGLEnabled?.()) {
//           throw new Error('WebGL is not supported in your browser');
//         }

//         // Create viewer
//         const viewer = window.$3Dmol.createViewer(viewerRef.current, {
//           backgroundColor: 'white'
//         });

//         // Set responsive size
//         const setViewerSize = () => {
//           viewer.setSize(
//             Math.min(window.innerWidth * 0.9, 1200),
//             Math.min(window.innerHeight * 0.8, 800)
//           );
//         };
//         setViewerSize();
//         window.addEventListener('resize', setViewerSize);

//         // Fetch from backend - using UPPERCASE for URL
//         const pdbUrl = `https://two4-cp-backend2.onrender.com/filtered_pdbs/${fullPdbId}.pdb`;
//         console.log('Fetching PDB from:', pdbUrl);

//         const response = await fetch(pdbUrl);
//         if (!response.ok) {
//           throw new Error(`PDB not found (HTTP ${response.status})`);
//         }

//         const pdbData = await response.text();
//         viewer.addModel(pdbData, 'pdb');
//         viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
//         viewer.zoomTo();
//         viewer.render();

//         setLoading(false);

//         return () => {
//           window.removeEventListener('resize', setViewerSize);
//           viewer.clear();
//         };
//       } catch (err) {
//         console.error('Viewer error:', err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     initViewer();
//   }, [fullPdbId]);

//   const handleSimilarityClick = (threshold) => {
//     navigate(`/percent/${fullPdbId}/${threshold}`);
//   };

//   // Helper functions
//   const waitFor3DMol = () => {
//     return new Promise(resolve => {
//       const check = () => {
//         if (window.$3Dmol?.createViewer) resolve();
//         else setTimeout(check, 100);
//       };
//       check();
//     });
//   };

//   const loadScript = (src) => {
//     return new Promise((resolve, reject) => {
//       const script = document.createElement('script');
//       script.src = src;
//       script.onload = resolve;
//       script.onerror = () => reject(new Error(`Failed to load 3DMol`));
//       document.body.appendChild(script);
//     });
//   };

//   if (error) {
//     return (
//       <div className="error-container">
//         <h2>Error Loading Structure</h2>
//         <p>{error}</p>
//         <div className="error-details">
//           <p>Failed to load: {fullPdbId}</p>
//           <p>Endpoint used: https://two4-cp-backend2.onrender.com/filtered_pdbs/{fullPdbId}.pdb</p>
//           <p>Please check:</p>
//           <ul>
//             <li>The PDB ID includes chain identifier (e.g., 1ABT_B)</li>
//             <li>The file exists on the server with UPPERCASE filename</li>
//             <li>Your network connection is stable</li>
//           </ul>
//         </div>
//         <button onClick={() => navigate('/')}>Back to Home</button>
//       </div>
//     );
//   }

//   return (
//     <div className="viewer-container">
//       <header>
//         <h1>3D Viewer: {fullPdbId}</h1>
//         <button onClick={() => navigate('/')}>Back</button>
//         <button onClick={() => handleSimilarityClick(70)}>Show Similar (70%)</button>
//       </header>

//       {loading && (
//         <div className="loading">
//           <div className="spinner"></div>
//           <p>Loading {fullPdbId} structure...</p>
//         </div>
//       )}

//       <div 
//         ref={viewerRef} 
//         style={{ 
//           width: '90%', 
//           height: '70vh', 
//           margin: '20px auto', 
//           border: '1px solid #ddd' 
//         }}
//       />
//     </div>
//   );
// };

// export default Desktop3dViewerPage;

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import MolFrame from "../Shared/features/3dMolFrame";
import ProteinViewer from "../Shared/features/ProteinViewer";

export default function Desktop3dViewerPage() {
  const { pdbId } = useParams(); // <-- this is correct param
  const navigate = useNavigate();

  // Don’t render if param is missing
  if (!pdbId) return <div style={{ padding: 20 }}>Invalid PDB ID</div>;

  const handleSimilarityClick = threshold => {
    const baseId = pdbId.split("_")[0].toLowerCase();
    navigate(`/percent/${baseId}/${threshold}`);
  };

  return (
    <MolFrame>
      <ProteinViewer pdbId={pdbId.toUpperCase()} />

      <div style={{ position: "absolute", bottom: 16, left: 16 }}>
        {[50, 65, 75].map(t => (
          <button key={t} onClick={() => handleSimilarityClick(t)}>
            {t}% Similar
          </button>
        ))}
      </div>
    </MolFrame>
  );
}
