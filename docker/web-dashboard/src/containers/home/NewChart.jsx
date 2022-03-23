import React, { useEffect, useState } from "react";
import {  Button, Form, Input, message, InputNumber } from "antd";
import { useRealmApp } from "../../RealmApp";

export const ChartDetail = (props) => {
  const { edgeId, currentItem, onClose } = props;
  const app = useRealmApp();
  const [chart, setChart] = useState({
    name: "",
    chartId: "",
    edgeId,
    width:"",
    isActive: true,
  });

  useEffect(()=>{
      if(currentItem){
        setChart(currentItem)
      } 
  }, [currentItem])

  const onChangeHander = ({target})=> setChart({...chart, [target.name]:target.value})

  return (
    <Form
      onFinish={(e) => {
          delete chart._id;
        app.createOrUpdateChart(chart).then(res=>{
            message.success("Success !!!")
            onClose()
        })
      }}
    >
      <Form.Item
        name="name"
      >
        <p>
          Name of the chart
          <br />
          <span style={{ fontSize: "small", opacity: 0.5 }}>
            A Unique name to identify your Chart.
          </span>
        </p>
        <Input required value={chart.name} name="name" style={{ width: "100%" }} onChange={onChangeHander} />
      </Form.Item>
      <Form.Item
        name="chartId"
      >
        <p>
          Chart Id
          <br />
          <span style={{ fontSize: "small", opacity: 0.5 }}>
            This is generated from Mongo
            Chart's(eg:2a801138-2a34-4bc0-a0fc-2f87fbe0d18e).{" "}
          </span>
        </p>
        <Input required value={chart.chartId} name="chartId" style={{ width: "100%" }} onChange={onChangeHander} />
      </Form.Item>
      <Form.Item
        name="width"
      >
        <p>
          Max Width
          <br />
          <span style={{ fontSize: "small", opacity: 0.5 }}>
            Max width in %  a chart needed to be rendered of the window{" "}
          </span>
        </p>
        <InputNumber required value={chart.width} name="width" style={{ width: "100%" }} onChange={(width) => {setChart({...chart, width})}} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
