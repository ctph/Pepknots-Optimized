import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Button, Space, Card, Tag, Divider, Flex } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import MolFrame       from "../Shared/features/3dMolFrame";
import ProteinViewer  from "../Shared/features/ProteinViewer";
import TitleBar       from "../Shared/components/TitleBar";

const { Title, Text } = Typography;

export default function Mobile3dPage() {
  const { pdbId } = useParams();
  const navigate  = useNavigate();
  const [metadata, setMetadata] = useState(null);

  const coreId = pdbId?.split("_")[0].toLowerCase();

  /* ───────────────────────── Fetch metadata ───────────────────────── */
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch(
          `https://data.rcsb.org/rest/v1/core/entry/${coreId}`
        );
        if (!res.ok) throw new Error("Meta fetch failed");
        setMetadata(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchMeta();
  }, [coreId]);

  const handleSimilarity = (threshold) =>
    navigate(`/percent/${coreId}/${threshold}`);

  /* ───────────────────────────── Render ───────────────────────────── */
  return (
    <>
      <TitleBar />

      <div style={{ textAlign: "center", padding: "0.75rem 0.5rem" }}>
        <Title level={4} style={{ margin: 0, lineHeight: 1.25 }}>
          Similarity for {pdbId.toUpperCase()}
        </Title>

        <Space wrap size="small" style={{ marginTop: 8, justifyContent: "center" }}>
          {[50, 65, 75].map((t) => (
            <Button size="small" key={t} onClick={() => handleSimilarity(t)}>
              {t}%
            </Button>
          ))}
          <Button
            size="small"
            type="primary"
            href={`https://www.rcsb.org/structure/${coreId.toUpperCase()}`}
            target="_blank"
          >
            RCSB
          </Button>
        </Space>
      </div>

      {/* Viewer fills 55 vh to leave room for metadata below */}
      <MolFrame height="55vh" minHeight="260px">
        <ProteinViewer pdbId={pdbId.toUpperCase()} />
      </MolFrame>

      {/* Metadata card – full-width on mobile */}
      <Card
        size="small"
        style={{
          margin: "1rem 0.5rem 2rem",
          borderRadius: 8,
          border: "1px solid #f0f0f0",
        }}
        title={
          <Space size="small">
            <InfoCircleOutlined />
            <Text strong>Structure Info</Text>
          </Space>
        }
      >
        {metadata ? (
          <Space direction="vertical" size="small" style={{ width: "100%" }}>
            <div>
              <Text type="secondary">Title</Text>
              <div style={{ marginTop: 2 }}>{metadata.struct?.title || "N/A"}</div>
            </div>

            <Divider style={{ margin: "6px 0" }} />

            <div>
              <Text type="secondary">Method</Text>
              <div style={{ marginTop: 2 }}>
                {metadata.exptl?.[0]?.method || "N/A"}
              </div>
            </div>

            <div>
              <Text type="secondary">Released</Text>
              <div style={{ marginTop: 2 }}>
                {metadata.rcsb_accession_info?.initial_release_date || "N/A"}
              </div>
            </div>

            <Divider style={{ margin: "6px 0" }} />

            <div>
              <Text type="secondary">Organism</Text>
              <div style={{ marginTop: 2 }}>
                {metadata.rcsb_entity_source_organism?.[0]
                  ?.organism_scientific_name || "Unknown"}
              </div>
            </div>

            {metadata.pdbx_database_status?.status && (
              <>
                <Divider style={{ margin: "6px 0" }} />
                <div>
                  <Text type="secondary">Status</Text>
                  <div style={{ marginTop: 2 }}>
                    <Tag
                      color={
                        metadata.pdbx_database_status.status === "REL"
                          ? "green"
                          : "orange"
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
          <Flex
            style={{ height: 80 }}
            justify="center"
            align="center"
          >
            <Text type="secondary">Loading metadata…</Text>
          </Flex>
        )}
      </Card>
    </>
  );
}
