import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Papa from 'papaparse';
import { Typography, Card, Table, Tag, Tooltip } from 'antd';
import TitleBar from '../Shared/components/TitleBar';
import "../Desktop/DesktopSimilarityPage";

const { Title, Text } = Typography;

export default function DesktopSimilarityPage() {
  const { pdbId, threshold } = useParams(); 
  const [similarData, setSimilarData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      Papa.parse('/sequence_similarity_output.csv', {
        header: true,
        download: true,
        complete: (result) => {
          const data = result.data;

          const cleanId = pdbId.split('_')[0].toUpperCase();
          const target = data.find(row => row.pdb_id?.toUpperCase() === cleanId);
          if (!target) return;

          const simField = `similarity_${threshold}`;
          const similarIds = target[simField]
            ?.replaceAll('"', '')
            .split(',')
            .map(id => id.trim().toUpperCase())
            .filter(Boolean);

          const matchedRows = data
            .filter(row => similarIds.includes(row.pdb_id?.toUpperCase()))
            .map(row => ({
              key: row.pdb_id,
              pdb_id: row.pdb_id,
              sequence: row.sequence,
              classification: row.Classification,
              melting: row['melting point (K)'],
            }));

          setSimilarData(matchedRows);
        }
      });
    };

    fetchData();
  }, [pdbId, threshold]);

  const columns = [
    {
      title: 'PDB ID',
      dataIndex: 'pdb_id',
      key: 'pdb_id',
      render: (id) => (
        <Link to={`/viewer/${id.toLowerCase()}_a`}>
          <Tag color="blue">{id}</Tag>
        </Link>
      ),
      width: 100,
    },
    {
      title: 'Sequence',
      dataIndex: 'sequence',
      key: 'sequence',
      render: (seq) => (
        <Tooltip title={seq}>
          <Text
            ellipsis
            style={{
              fontFamily: 'monospace',
              display: 'inline-block',
              maxWidth: 300,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {seq}
          </Text>
        </Tooltip>
      ),
      width: 300,
    },
    {
      title: 'Classification',
      dataIndex: 'classification',
      key: 'classification',
      width: 200,
      ellipsis: true,
    },
    {
      title: 'Melting Point (K)',
      dataIndex: 'melting',
      key: 'melting',
      width: 150,
      ellipsis: true,
    },
  ];

  return (
    <>
      <TitleBar />

      <div className="percent-page-container">
        <Title level={2} style={{ textAlign: 'center' }}>
          Similar Structures to {pdbId.toUpperCase()} at {threshold}% Similarity
        </Title>

        <Card className="similarity-card" style={{ marginTop: 16 }}>
          <div style={{ overflowX: 'auto' }}>
            <Table
              rowClassName={() => 'compact-row'}
              dataSource={similarData}
              columns={columns}
              pagination={{ pageSize: 10 }}
              bordered
              size="small"
              scroll={{ x: true }}
              tableLayout="fixed"
            />
          </div>
        </Card>
      </div>
    </>
  );
}
