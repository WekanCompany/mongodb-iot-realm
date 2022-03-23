import React from "react";
import { Table } from "antd";
export const Edgelist = (props) => {
 
  const columns = [
    {
      title: "Edge Id",
      dataIndex: "edgeId",
      key: "edgeId",
    },
    {
      title: "Edge Name",
      dataIndex: "edgeName",
      key: "edgeName",
    },
    {
      title: "Sensors",
      dataIndex: "sensors",
      key: "sensors",
      render: (data, item) => `${data.length} Sensors`
    },
    {
      title: "Compaction",
      dataIndex: "compactSize",
      key: "compactSize",
      render: (data, item) => `when exceeding ${data} MB`
    },
  ];
  return <Table columns={columns} dataSource={props.edges} />;
};

Edgelist.defaultProps = {
    edges: []
}