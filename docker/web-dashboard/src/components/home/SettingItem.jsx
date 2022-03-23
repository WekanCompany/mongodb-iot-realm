import { useState } from "react";
import { Input, Row, Col, InputNumber } from "antd";
import { string, func, oneOfType, oneOf } from "prop-types";

export const SettingItem = (props) => {
  const {
    title,
    description,
    label,
    value,
    placeholder,
    onEditEnded,
    name,
    inputType,
  } = props;
  const [input, setInput] = useState(value);
  return (
    <Row style={{ width: "100%" }} className="setting-item">
      <Col span={14} className="information-container">
        <h3 className="title">{title}</h3>
        <p className="description">{description}</p>
      </Col>
      <Col span={10} className="input-container">
        <h3 className="label-placeholder">{label}</h3>
        {inputType === "text" && (
          <Input
            className="input-field"
            placeholder={placeholder}
            value={input}
            onBlur={() => {
              if (input.trim().length > 0) {
                onEditEnded && onEditEnded({ key: name, value: input });
              } else {
                setInput(value);
              }
            }}
            onChange={({ target }) => setInput(target.value)}
          />
        )}
        {inputType === "number" && (
          <InputNumber
            className="input-field"
            placeholder={placeholder}
            value={input}
            formatter={(value)=> `${value}`}
            onBlur={() => {
              if (input.toString().trim().length > 0) {
                onEditEnded && onEditEnded({ key: name, value: input });
              } else {
                setInput(value);
              }
            }}
            onChange={(value) => setInput(value)}
          />
        )}
      </Col>
    </Row>
  );
};

SettingItem.propTypes = {
  name: string.isRequired,
  title: string.isRequired,
  description: string.isRequired,
  label: string.isRequired,
  value: oneOfType(["string", "number"]),
  placeholder: string.isRequired,
  onEditEnded: func,
  inputType: oneOf(["string", "number"]),
};

SettingItem.defaultProps = {
  value: "",
};
