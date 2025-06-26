// Table of similar PDB at Similarity Page
// src/components/PdbInfo.jsx
import React, { useEffect, useState } from 'react';
import { Typography, Spin, Descriptions } from 'antd';

const { Title, Text } = Typography;

const PdbInfo = ({ pdbId }) => {
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pdbId) return;

    setLoading(true);
    const cleanId = pdbId.split('_')[0].toLowerCase();
    fetch(`https://data.rcsb.org/rest/v1/core/entry/${cleanId}`)
      .then(res => res.json())
      .then(data => {
        setMeta(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch metadata:", err);
        setMeta(null);
        setLoading(false);
      });
  }, [pdbId]);

  if (loading) return <Spin tip="Loading metadata..." />;

  if (!meta) return <Text type="danger">Failed to load metadata for {pdbId}</Text>;

  return (
    <div>
      {loading ? (
        <Spin tip="Loading metadata..." />
      ) : meta ? (
        <>
          <Title level={4} style={{ marginBottom: 12 }}>
            {meta?.struct?.title || "No title available"}
          </Title>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Classification">
              {meta.struct_keywords?.pdbx_keywords || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Experimental Method">
              {meta.exptl?.[0]?.method || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Organism">
              {meta.rcsb_entity_source_organism?.[0]?.organism_scientific_name || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Deposited">
              {meta.rcsb_accession_info?.initial_release_date || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Released">
              {meta.rcsb_accession_info?.revision_date || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="DOI">
              <a
                href={`https://doi.org/${meta.rcsb_accession_info?.deposit_doi}`}
                target="_blank"
                rel="noreferrer"
              >
                {meta.rcsb_accession_info?.deposit_doi || 'N/A'}
              </a>
            </Descriptions.Item>
          </Descriptions>
        </>
      ) : (
        <Text type="danger">Failed to load metadata for {pdbId}</Text>
      )}
    </div>
  );}

export default PdbInfo;
