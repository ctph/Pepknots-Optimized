// Table of available PDB at Home Page
import React, { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import { Link } from 'react-router-dom';

const PdbTable = () => {
  const [pdbs, setPdbs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/filtered_pdbs_list.json')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(filename => {
          const id = filename.replace('.pdb', '');
          return {
            id,
            sequence: '-',          // Placeholder
            cyclisation: '-',       // Placeholder
            filepath: `/filtered_pdbs/${filename}`,
          };
        });
        setPdbs(formatted);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: 'PDB ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Link to={`/similarity/${id.toUpperCase()}`}>
          <Tag color="blue">{id}</Tag>
        </Link>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Link to={`/similarity/${record.id.toUpperCase()}`} style={{ marginRight: 8 }}>
            View 3D
          </Link>
          <a href={record.filepath} download>
            Download
          </a>
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={pdbs}
      loading={loading}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};

export default PdbTable;
