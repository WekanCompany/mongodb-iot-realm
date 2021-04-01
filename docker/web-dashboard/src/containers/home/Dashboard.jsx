import { Button } from 'antd';
import React from 'react';
import { ReloadOutlined } from '@ant-design/icons';
import { useRealmApp } from '../../RealmApp';

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
      app.getCharts(currentEdge.edgeId, false).then((res) => {
        setCharts(res);
      });
    }
  }, [app, currentEdge]);

  return (
    <div className='dashboard-container'>
      <Button
        type='link'
        icon={<ReloadOutlined />}
        size='small'
        onClick={() => {
          fetchCharts();
        }}
      >
        Refresh
      </Button>
      <div
        id='chart'
        style={{
          display: 'flex',
          flexFlow: 'row wrap',
          justifyContent: 'space-around',
        }}
      >
        {charts.map((x, i) => (
          <iframe
            title={x.name}
            style={{
              border: 'none',
              height: '60vh',
              width: `${x.width || 50}%`,
            }}
            src={`https://charts.mongodb.com/charts-project-0-lweyh/embed/charts?id=${x.chartId}&theme=light`}
          ></iframe>
        ))}
      </div>
    </div>
  );
};
