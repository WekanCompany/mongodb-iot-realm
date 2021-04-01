import React, { useState, useEffect } from 'react';
import { Table, Switch, InputNumber } from 'antd';
import { toPlainObject } from 'lodash';
import useEdgeMutation from '../../graphql/useEdgesMutation';

export const DeviceList = (props) => {
  const { currentEdge } = props;
  const { updateEdge } = useEdgeMutation();
  const [sensors, setSensors] = useState([]);

  useEffect(() => {
    if (currentEdge) {
      setSensors(currentEdge.sensors);
    }
  }, [currentEdge]);

  const onSensorConfigurationChanged = (item, change) => {
    let tempSensors = [...sensors].map((x) => {
      const obj = toPlainObject(x);
      delete obj['__typename'];
      return obj;
    });
    const sensorIndex = tempSensors.findIndex(
      (x) => x.sensorId === item.sensorId
    );
    if (sensorIndex !== -1) {
      tempSensors[sensorIndex] = {
        ...tempSensors[sensorIndex],
        [change.key]: change.value,
      };
    }
    setSensors([...tempSensors]);
    updateEdge(currentEdge, { sensors: [...tempSensors] });
  };

  const columns = [
    {
      title: 'Sensor Id',
      dataIndex: 'sensorId',
      key: 'sensorId',
    },
    {
      title: 'Sensor Name',
      dataIndex: 'sensorName',
      key: 'sensorName',
    },
    {
      title: 'Alert',
      dataIndex: 'isConfigured',
      key: 'isConfigured',
      render: (data, item) => (
        <Switch
          checked={data}
          onChange={(status) => {
            onSensorConfigurationChanged(item, {
              key: 'isConfigured',
              value: status,
            });
          }}
        />
      ),
    },
    {
      title: 'Threshold (metric)',
      dataIndex: 'treshold',
      key: 'treshold',
      render: (data, item) =>
        !item.isConfigured ? (
          <p>{data ? data : 'N/A'}</p>
        ) : (
          <InputNumber
            defaultValue={data}
            onBlur={({ target }) =>
              onSensorConfigurationChanged(item, {
                key: 'treshold',
                value: target.value,
              })
            }
          />
        ),
    },
  ];
  return <Table columns={columns} dataSource={sensors} />;
};
