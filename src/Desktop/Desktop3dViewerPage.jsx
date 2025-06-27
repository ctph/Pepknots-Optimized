// /src/Desktop/Desktop3dViewerPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Space } from "antd";
import MolFrame        from "../Shared/features/3dMolFrame";
import ProteinViewer   from "../Shared/features/ProteinViewer";
import TitleBar        from "../Shared/components/TitleBar";

const { Title } = Typography;

export default function Desktop3dViewerPage() {
  const { pdbId } = useParams();      // <--- from /viewer/:pdbId
  const navigate = useNavigate();

  if (!pdbId) return <div style={{ padding: 20 }}>Invalid PDB ID</div>;

  /** jump to /percent/<base>/<threshold> */
  const handleSimilarityClick = threshold => {
    const baseId = pdbId.split("_")[0].toLowerCase();
    navigate(`/percent/${baseId}/${threshold}`);
  };

  return (
    <>
      {/* ─────────────────────────────  Header  ───────────────────────────── */}
      <TitleBar />

      {/* subtitle + action buttons */}
      <div style={{ textAlign: "center", margin: "1rem 0" }}>
        <Title level={3} style={{ margin: 0 }}>
          Similarity for {pdbId.toUpperCase()}
        </Title>

        <Space size="middle" style={{ marginTop: "0.5rem" }}>
          {[50, 65, 75].map(t => (
            <Button key={t} onClick={() => handleSimilarityClick(t)}>
              {t}% Similar
            </Button>
          ))}
          <Button
            type="primary"
            href={`https://www.rcsb.org/structure/${pdbId.split("_")[0].toUpperCase()}`}
            target="_blank"
          >
            View on RCSB
          </Button>
        </Space>
      </div>

      {/* ─────────────────────────  3D viewer frame  ──────────────────────── */}
      <MolFrame height="70vh">  {/* or any other height you like */}
        <ProteinViewer pdbId={pdbId.toUpperCase()} />
      </MolFrame>
    </>
  );
}
