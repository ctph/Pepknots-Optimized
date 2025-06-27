// Table of available PDB at Home Page
import React, { useState, useEffect } from 'react';
import { Table, Tag, Spin, Alert } from 'antd';
import { Link } from 'react-router-dom';

const PdbTable = () => {
  const [pdbs, setPdbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/filtered_pdbs_list.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch PDB list');
        return res.json();
      })
      .then(data => {
        const formatted = data.map(filename => ({
          id: filename.replace('.pdb', ''),
          sequence: '-',
          cyclisation: '-',
          filepath: `/filtered_pdbs/${filename}`,
        }));
        setPdbs(formatted);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      title: 'PDB ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Link to={`/viewer/${id.toUpperCase()}`}>
          <Tag color="blue">{id}</Tag>
        </Link>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Link to={`/viewer/${record.id.toUpperCase()}`} style={{ marginRight: 8 }}>
            View 3D
          </Link>
          <a href={record.filepath} download>
            Download
          </a>
        </>
      ),
    },
  ];

  if (error) return <Alert message={error} type="error" showIcon />;

  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={pdbs}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Spin>
  );
};

export default PdbTable;