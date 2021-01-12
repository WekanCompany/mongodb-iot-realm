import React from "react";
import * as Realm from "realm-web";
import { Form, Input, Button, message } from "antd";
import { useRealmApp } from "../RealmApp";

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const Login = (props) => {
  const app = useRealmApp();
  // Keep track of form input state
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    try {
      await app.logIn(Realm.Credentials.emailPassword(email, password));
    } catch (err) {
      handleAuthenticationError(err, message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <img
      style={{marginBottom:40}}
        src={`${process.env.PUBLIC_URL}/assets/realm-horizontal.svg`}
        width="300px"
        height="auto"
        alt=""
      />
      <Form name="basic" onFinish={handleLogin}>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input
            name="email"
            type="email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            name="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

function handleAuthenticationError(err, setError) {
  const { status, message } = parseAuthenticationError(err);
  const errorType = message || status;
  switch (errorType) {
    case "invalid username":
      setError.error("Invalid email address.");
      break;
    case "invalid username/password":
    case "invalid password":
    case "401":
      setError.error("Incorrect password.");
      break;
    default:
      break;
  }
}

function parseAuthenticationError(err) {
  const parts = err.message.split(":");
  const reason = parts[parts.length - 1].trimStart();
  if (!reason) return { status: "", message: "" };
  const reasonRegex = /(?<message>.+)\s\(status (?<status>[0-9][0-9][0-9])/;
  const match = reason.match(reasonRegex);
  const { status, message } = match?.groups ?? {};
  return { status, message };
}
