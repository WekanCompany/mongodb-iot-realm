import { Button } from "antd";
import React from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { useRealmApp } from "../../RealmApp";

export const Dashboard = (props) => {
  const { currentEdge } = props;
  const app = useRealmApp();
  const [charts, setCharts] = React.useState([]);

  const fetchCharts = () => {
    app.getCharts(currentEdge.edgeId, false).then((res) => {
      setCharts(res);
    });
  };
  React.useEffect(() => {
    if (currentEdge) {
      fetchCharts();
    }
  }, [app, currentEdge]);

  return (
    <div className="dashboard-container">
      <div style={{width:"100%", textAlign:"right"}}>
      <Button
        type="link"
        icon={<ReloadOutlined />}
        size="small"
        style={{border:"solid 1px #eaeaea", marginBottom:20}}
        onClick={() => {
          if (currentEdge) {
            fetchCharts();
          }
        }}
      >
        Refresh
      </Button>
      </div>
      <div
        id="chart"
        style={{
          display: "flex",
          flexFlow: "row wrap",
          justifyContent: "space-around",
        }}
      >
        {charts.map((x, i) => (
          <iframe
            title={x.name}
            style={{
              border: "1px solid #eaeaea",
              height: "60vh",
              width: `${x.width || 50}%`,
            }}
            src={`https://charts.mongodb.com/charts-project-0-lweyh/embed/charts?id=${x.chartId}&theme=light`}
          ></iframe>
        ))}
      </div>
    </div>
  );
};
