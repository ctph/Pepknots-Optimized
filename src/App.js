// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import useIsMobile from './hooks/useIsMobile';

// /* Desktop pages  */
// import DesktopHomePage from './Desktop/DesktopHomePage';
// import DesktopSimilarityPage from './Desktop/DesktopSimilarityPage';
// import Desktop3dViewerPage from './Desktop/Desktop3dViewerPage';

// /* Mobile pages   */
// import MobileHomePage from './Mobile/MobileHomePage';
// import MobileSimilarityPage from './Mobile/MobileSimilarityPage';
// import Mobile3dPage from './Mobile/Mobile3dPage';

// function App() {
//   const isMobile = useIsMobile();

//   return (
//     <Router>
//       <Routes>
//         {/* --- Home --------------------------------------------------- */}
//         <Route
//           path="/"
//           element={isMobile ? <MobileHomePage /> : <DesktopHomePage />}
//         />

//         {/* --- Similarity -------------------------------------------- */}
//         <Route 
//           path="/viewer/:pdbId" 
//           element={isMobile ? <Mobile3dPage /> : <Desktop3dViewerPage />} 
//         />

//         {/* --- 3-D viewer ------------------------------------------- */}
//         <Route
//           path="/viewer/:pdbId"
//           element={isMobile ? <Mobile3dPage /> : <Desktop3dViewerPage />}
//         />

//         {/* --- Short or malformed URLs → home ----------------------- */}
//         <Route path="/similarity" element={<Navigate to="/" replace />} />
//         <Route path="/percent"    element={<Navigate to="/" replace />} />

//         {/* --- 404 catch-all ---------------------------------------- */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;


// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import useIsMobile from "./hooks/useIsMobile";

/* Desktop pages */
import DesktopHomePage       from "./Desktop/DesktopHomePage";
import DesktopSimilarityPage from "./Desktop/DesktopSimilarityPage";
import Desktop3dViewerPage   from "./Desktop/Desktop3dViewerPage";

/* Mobile pages */
import MobileHomePage       from "./Mobile/MobileHomePage";
import MobileSimilarityPage from "./Mobile/MobileSimilarityPage";
import Mobile3dPage         from "./Mobile/Mobile3dPage";

function App() {
  const isMobile = useIsMobile();

  return (
    <Router>
      <Routes>
        {/* ---------- Home ------------------------------------------ */}
        <Route
          path="/"
          element={isMobile ? <MobileHomePage /> : <DesktopHomePage />}
        />

        {/* ---------- 3-D viewer ------------------------------------ */}
        <Route
          path="/viewer/:pdbId"
          element={isMobile ? <Mobile3dPage /> : <Desktop3dViewerPage />}
        />

        {/* ---------- Similarity lists ------------------------------ */}
        {/* Matches e.g. /percent/1ag7/65 */}
        <Route
          path="/percent/:pdbId/:threshold"
          element={isMobile ? <MobileSimilarityPage /> : <DesktopSimilarityPage />}
        />

        {/* ---------- Short or malformed URLs → home --------------- */}
        <Route path="/similarity" element={<Navigate to="/" replace />} />
        <Route path="/percent"    element={<Navigate to="/" replace />} />

        {/* ---------- 404 catch-all --------------------------------- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
