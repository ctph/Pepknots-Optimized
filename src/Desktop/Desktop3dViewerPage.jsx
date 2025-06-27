// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Typography, Button, Space } from "antd";
// import MolFrame      from "../Shared/features/3dMolFrame";
// import ProteinViewer from "../Shared/features/ProteinViewer";
// import TitleBar      from "../Shared/components/TitleBar";

// const { Title } = Typography;

// export default function Desktop3dViewerPage() {
//   const { pdbId } = useParams();          // URL param from /viewer/:pdbId
//   const navigate = useNavigate();

//   if (!pdbId) return <div style={{ padding: 20 }}>Invalid PDB ID</div>;

//   /** Jump to /percent/<fullPdbId>/<threshold> */
//   const handleSimilarityClick = threshold =>
//     navigate(`/percent/${pdbId.toLowerCase()}/${threshold}`);

//   return (
//     <>
//       <TitleBar />

//       <div style={{ textAlign: "center", margin: "1rem 0" }}>
//         <Title level={3} style={{ margin: 0 }}>
//           Similarity for {pdbId.toUpperCase()}
//         </Title>

//         <Space size="middle" style={{ marginTop: 8 }}>
//           {[50, 65, 75].map(percent => (
//             <Button
//               key={percent}
//               onClick={() => handleSimilarityClick(percent)}
//             >
//               {percent}% Similar
//             </Button>
//           ))}
//           <Button
//             type="primary"
//             href={`https://www.rcsb.org/structure/${pdbId.split("_")[0].toUpperCase()}`}
//             target="_blank"
//           >
//             View on RCSB
//           </Button>
//         </Space>
//       </div>

//       <MolFrame height="70vh">
//         <ProteinViewer pdbId={pdbId.toUpperCase()} />
//       </MolFrame>
//     </>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Space, Card, Tag, Divider, Flex } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import MolFrame from "../Shared/features/3dMolFrame";
import ProteinViewer from "../Shared/features/ProteinViewer";
import TitleBar from "../Shared/components/TitleBar";

const { Title, Text } = Typography;

export default function Desktop3dViewerPage() {
  const { pdbId } = useParams();
  const navigate = useNavigate();
  const [metadata, setMetadata] = useState(null);

  const coreId = pdbId?.split("_")[0].toLowerCase();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${coreId}`);
        if (!response.ok) throw new Error("Metadata fetch failed");
        const data = await response.json();
        setMetadata(data);
      } catch (err) {
        console.error("Metadata error:", err);
      }
    };
    fetchMetadata();
  }, [coreId]);

  const handleSimilarityClick = (threshold) => {
    const baseId = pdbId.split("_")[0].toLowerCase();
    navigate(`/percent/${baseId}/${threshold}`);
  };

  return (
    <>
      <TitleBar />

      <div style={{ textAlign: "center", margin: "1rem 0" }}>
        <Title level={3} style={{ margin: 0 }}>
          Similarity for {pdbId?.toUpperCase()}
        </Title>

        <Space size="middle" style={{ marginTop: "0.5rem" }}>
          {[50, 65, 75].map((t) => (
            <Button key={t} onClick={() => handleSimilarityClick(t)}>
              {t}% Similar
            </Button>
          ))}
          <Button
            type="primary"
            href={`https://www.rcsb.org/structure/${coreId.toUpperCase()}`}
            target="_blank"
          >
            View on RCSB
          </Button>
        </Space>
      </div>

      <Flex gap="large" justify="center" style={{ margin: "2rem 2rem" }}>
        {/* Viewer Section */}
        <MolFrame height="70vh">
          <ProteinViewer pdbId={pdbId.toUpperCase()} />
        </MolFrame>

        {/* Metadata Card */}
        <Card
          title={
            <Space>
              <Text strong>Structure Information</Text>
              <Tag icon={<InfoCircleOutlined />} color="cyan">
                Details
              </Tag>
            </Space>
          }
          style={{
            width: "400px",
            borderRadius: "12px",
            boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
            border: "1px solid #f0f0f0",
          }}
        >
          {metadata ? (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Text type="secondary">Title</Text>
                <div style={{ marginTop: 4 }}>
                  {metadata.struct?.title || "Not available"}
                </div>
              </div>

              <Divider style={{ margin: "8px 0" }} />

              <Flex justify="space-between">
                <div>
                  <Text type="secondary">Method</Text>
                  <div style={{ marginTop: 4 }}>
                    {metadata.exptl?.[0]?.method || "N/A"}
                  </div>
                </div>
                <div>
                  <Text type="secondary">Released</Text>
                  <div style={{ marginTop: 4 }}>
                    {metadata.rcsb_accession_info?.initial_release_date || "N/A"}
                  </div>
                </div>
              </Flex>

              <Divider style={{ margin: "8px 0" }} />

              <div>
                <Text type="secondary">Organism</Text>
                <div style={{ marginTop: 4 }}>
                  {metadata.rcsb_entity_source_organism?.[0]?.organism_scientific_name || "Unknown"}
                </div>
              </div>

              {metadata.pdbx_database_status?.status && (
                <>
                  <Divider style={{ margin: "8px 0" }} />
                  <div>
                    <Text type="secondary">Status</Text>
                    <div style={{ marginTop: 4 }}>
                      <Tag
                        color={
                          metadata.pdbx_database_status.status === "REL" ? "green" : "orange"
                        }
                      >
                        {metadata.pdbx_database_status.status === "REL"
                          ? "Released"
                          : metadata.pdbx_database_status.status}
                      </Tag>
                    </div>
                  </div>
                </>
              )}
            </Space>
          ) : (
            <Flex justify="center" align="center" style={{ height: "100px" }}>
              <Text type="secondary">No metadata available</Text>
            </Flex>
          )}
        </Card>
      </Flex>
    </>
  );
}
