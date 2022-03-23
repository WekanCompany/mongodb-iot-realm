import { useState } from "react";
import { Row, Col, Select, TimePicker } from "antd";
import { string, func, object } from "prop-types";
import moment from 'moment';

const { Option } = Select;
export const UpgraderItem = (props) => {
  const { title, description, label, value, onEditEnded } = props;
  const [input, setInput] = useState(value);
  return (
    <Row style={{ width: "100%" }} className="setting-item">
      <Col span={14} className="information-container">
        <h3 className="title">{title}</h3>
        <p className="description">{description}</p>
      </Col>
      <Col span={10} className="input-container">
        <h3 className="label-placeholder">{label}</h3>
        <Row>
          <Col span={11}>
            {" "}
            <Select
              showSearch
              style={{ width: 200 }}
              placeholder="Select a day"
              optionFilterProp="children"
              value={input.upgradeDay}
              onChange={(res) => {
                let newValue = { ...input, upgradeDay: res.toString() }
                setInput(newValue);
                onEditEnded(newValue);
              }}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              <Option value="0">Sunday</Option>
              <Option value="1">Monday</Option>
              <Option value="2">Tuesday</Option>
              <Option value="3">Wednesday</Option>
              <Option value="4">Thursday</Option>
              <Option value="5">Friday</Option>
              <Option value="6">Saturday</Option>
            </Select>
          </Col>
          <Col span={11} offset={2}>
            <TimePicker
              format={"HH:mm"}
              value={moment(input.upgradeTime,'HH:mm')}
              onChange={(_res, stringDate) => {
                let newValue = { ...input, upgradeTime: stringDate }
                setInput(newValue);
                onEditEnded(newValue);
              }}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

UpgraderItem.propTypes = {
  name: string.isRequired,
  title: string.isRequired,
  description: string.isRequired,
  label: string.isRequired,
  value: object.isRequired,
  placeholder: string.isRequired,
  onEditEnded: func,
};

UpgraderItem.defaultProps = {
  value: "",
};
