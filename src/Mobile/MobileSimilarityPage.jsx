import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Papa from "papaparse";
import { useMediaQuery } from "react-responsive";
import {
  Typography,
  Card,
  Table,
  Tag,
  Tooltip,
  List,
  Space,
  Divider,
} from "antd";
import TitleBar from "../Shared/components/TitleBar";
import "./MobileSimilarityPage.css";

const { Title, Text } = Typography;

export default function ResponsiveSimilarityPage() {
  /* URL params */
  const { pdbId, threshold } = useParams();

  /* Data state */
  const [similarData, setSimilarData] = useState([]);

  /* Mobile flag */
  const isMobile = useMediaQuery({ maxWidth: 767 });

  /* CSV fetch */
  useEffect(() => {
    Papa.parse("/sequence_similarity_output.csv", {
      header: true,
      download: true,
      complete: ({ data }) => {
        const clean = pdbId.split("_")[0].toUpperCase();
        const record = data.find((r) => r.pdb_id?.toUpperCase() === clean);
        if (!record) return;

        const field = `similarity_${threshold}`;
        const ids = record[field]
          ?.replaceAll('"', "")
          .split(",")
          .map((id) => id.trim().toUpperCase())
          .filter(Boolean);

        const rows = data
          .filter((r) => ids.includes(r.pdb_id?.toUpperCase()))
          .map((r) => ({
            key: r.pdb_id,
            pdb_id: r.pdb_id,
            sequence: r.sequence,
            classification: r.Classification,
            melting: r["melting point (K)"],
          }));

        setSimilarData(rows);
      },
    });
  }, [pdbId, threshold]);

  /* Table columns (desktop only) */
  const columns = [
    {
      title: "PDB ID",
      dataIndex: "pdb_id",
      key: "pdb_id",
      render: (id) => (
        <Link to={`/viewer/${id.toLowerCase()}_a`}>
          <Tag color="blue">{id}</Tag>
        </Link>
      ),
      width: 100,
    },
    {
      title: "Sequence",
      dataIndex: "sequence",
      key: "sequence",
      render: (seq) => (
        <Tooltip title={seq}>
          <Text
            ellipsis
            style={{
              fontFamily: "monospace",
              display: "inline-block",
              maxWidth: 300,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {seq}
          </Text>
        </Tooltip>
      ),
      width: 300,
    },
    {
      title: "Classification",
      dataIndex: "classification",
      key: "classification",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Melting Point (K)",
      dataIndex: "melting",
      key: "melting",
      width: 150,
      ellipsis: true,
    },
  ];

  /* Mobile card renderer */
  const renderMobileItem = (item) => (
    <Card
      size="small"
      style={{ marginBottom: 12 }}
      title={
        <Space>
          <Link to={`/viewer/${item.pdb_id.toLowerCase()}_a`}>
            <Tag color="blue">{item.pdb_id}</Tag>
          </Link>
          <Text type="secondary">{item.classification || "N/A"}</Text>
        </Space>
      }
    >
      <div style={{ fontFamily: "monospace", wordBreak: "break-all" }}>
        {item.sequence}
      </div>

      <Divider style={{ margin: "8px 0" }} />

      <Space size="small">
        <Text type="secondary">Melting (K):</Text>
        {item.melting || "N/A"}
      </Space>
    </Card>
  );

  /* ─────────────────────────────  JSX  ───────────────────────────── */
  return (
    <>
      <TitleBar />

      <div className="percent-page-container">
        <Title level={isMobile ? 4 : 2} style={{ textAlign: "center" }}>
          Similar Structures to {pdbId.toUpperCase()} at {threshold}% Similarity
        </Title>

        <Card className="similarity-card" style={{ marginTop: 16 }}>
          {isMobile ? (
            <List
              dataSource={similarData}
              renderItem={renderMobileItem}
              locale={{ emptyText: "No similar structures found." }}
            />
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Table
                rowClassName={() => "compact-row"}
                dataSource={similarData}
                columns={columns}
                pagination={{ pageSize: 10 }}
                bordered
                size="small"
                scroll={{ x: true }}
                tableLayout="fixed"
              />
            </div>
          )}
        </Card>
      </div>
    </>
  );
}
