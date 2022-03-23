import React, { useState, useEffect } from "react";
import { element } from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { Layout, Dropdown, Button, Menu, Popconfirm } from "antd";
import { useRealmApp } from "../RealmApp";
import {
  DownOutlined,
  SignalFilled,
  OrderedListOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import useEdges from "../graphql/useEdges";

const { Header, Content } = Layout;

export const BaseLayout = ({ children }) => {
  const { edges } = useEdges();
  const app = useRealmApp();
  const [currentEdge, updateSelectedEdge] = useState(null);
  useEffect(() => {
    updateSelectedEdge(edges[0]);
  }, [edges]);

  let location = useLocation();
  
  const menu = (
    <Menu
      activeKey={(currentEdge && currentEdge.id) || -1}
      onClick={({ key }) => {
        if (key !== "all") {
          updateSelectedEdge(edges.find((x) => x._id == key));
        }
      }}
    >
      {edges.map((item) => (
        <Menu.Item key={item._id} icon={<SignalFilled />}>
          {item.edgeName}
        </Menu.Item>
      ))}
      <Menu.Divider></Menu.Divider>
      <Menu.Item key="all" icon={<OrderedListOutlined />}>
        <Link to="/edges"> View All Edges</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        className="page-header"
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Link to="/">
            <img
              src={`${process.env.PUBLIC_URL}/assets/realm-horizontal.svg`}
              width="200px"
              height="auto"
              alt=""
            />
          </Link>
        </div>
        <div style={{ float: "right" }}>
          <>
            {location.pathname !== "/edges" && (
              <>
                <span title="Choose your current edge">
                  <ApartmentOutlined />
                </span>
                <Dropdown overlay={menu}>
                  <Button type="link" title="current edge">
                    {currentEdge && currentEdge.edgeName}
                    <DownOutlined />
                  </Button>
                </Dropdown>
              </>
            )}
            <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={()=>{   app.logOut();}}>
              <Button
                type="primary"
              >
                Log out
              </Button>
            </Popconfirm>
          </>
        </div>
      </Header>
      <Content style={{ background: "white" }}>
        {React.cloneElement(children, { currentEdge, edges })}
      </Content>
    </Layout>
  );
};
BaseLayout.propTypes = {
  children: element,
};
