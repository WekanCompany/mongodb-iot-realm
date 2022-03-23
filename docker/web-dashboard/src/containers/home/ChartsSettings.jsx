import React from "react";
import { useRealmApp } from "../../RealmApp";
import { DeleteTwoTone, EditTwoTone } from "@ant-design/icons";
import { ChartDetail } from "./NewChart";
import { Table, Switch, Button, Drawer, message } from "antd";

export const ChartSettings = (props) => {
  const app = useRealmApp();
  const [charts, setCharts] = React.useState([]);
  const [showDrawer, setShowDrawer] = React.useState(false);
  const [selectedChart, setSelected] = React.useState(null);
  const { currentEdge } = props;
 
  const fetchEdges = () => {
    console.log(currentEdge)
    app.getCharts(currentEdge.edgeId, true).then((res) => {
      setCharts(res);
    });
  };

  const updateEdges = async (chart, isActive) => {
    message.loading("Updating...",1)
    
    chart = {
      ...chart,
      isActive
    }
    app.createOrUpdateChart(chart).then(res=>{
      message.success("Success !!!")
      fetchEdges()
  })
  }
  
  React.useEffect(() => {
    fetchEdges();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Chart Id",
      dataIndex: "chartId",
      key: "chartId",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (data, item) => (
        <Switch
          checked={data}
          onChange={(r) => {
            updateEdges(item, r)
          }}
        />
      ),
    },
    {
      title: "Action",
      render: (data , item) => (
        <>
        <Button type="link" icon={<EditTwoTone />} size="small" onClick={()=>{setSelected(item); setShowDrawer(true)}}>
          Edit
        </Button>
        <Button type="link" icon={<DeleteTwoTone />} size="small" onClick={()=>{console.log(item)}}>
          Delete
        </Button>
        </>
      ),
    },
  ];

  return (
    <div className="charts-settings">
      <Button
        type="default"
        style={{ float: "right", marginBottom: 20 }}
        onClick={() => {
          setShowDrawer(true);
        }}
      >
        Add New
      </Button>
      <Table dataSource={charts} columns={columns} />;
      {showDrawer && (
        <Drawer
          width={500}
          title="AddChart"
          placement="right"
          closable={true}
          onClose={() => {
            setShowDrawer(false);
          }}
          visible={showDrawer}
        >
          <ChartDetail
            edgeId={currentEdge.edgeId}
            onClose={() => {
              fetchEdges();
              setShowDrawer(false);
              setSelected(null)
            }}
            currentItem={selectedChart}
          />
        </Drawer>
      )}
    </div>
  );
};
