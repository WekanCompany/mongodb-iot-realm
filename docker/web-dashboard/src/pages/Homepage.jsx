import { Tabs } from "antd";
import React from "react";
import {
  FundTwoTone,
  ApiTwoTone,
  SettingTwoTone,
  PieChartTwoTone,
  CopyTwoTone,
} from "@ant-design/icons";
import { ChartSettings, DeviceList, Settings } from "../containers/home";
import { Dashboard } from "../containers/home/Dashboard";

const { TabPane } = Tabs;

export const HomePage = (props) => {
  return (
    <div className="home-page">
      <Tabs defaultActiveKey="1" className="dashboard">
        <TabPane
          tab={
            <h4 className="tab-header">
              <span>
                <FundTwoTone />
              </span>
              Dashboard
            </h4>
          }
          key="1"
        >
          <Dashboard {...props}/>
        </TabPane>
        <TabPane
          tab={
            <h4 className="tab-header">
              <span>
                <ApiTwoTone />
              </span>
              Device List
            </h4>
          }
          key="2"
        >
          <DeviceList {...props} />
        </TabPane>
        <TabPane
          disabled={!props.currentEdge}
          tab={
            <h4 className="tab-header settings-container">
              <span>
                <SettingTwoTone />
              </span>
              Settings
            </h4>
          }
          key="3"
        >
          <Settings {...props} />
        </TabPane>
        <TabPane
          disabled={!props.currentEdge}
          tab={
            <h4 className="tab-header charts-settings-container">
              <span>
                <PieChartTwoTone />
              </span>
              Charts
            </h4>
          }
          key="4"
        >
          <ChartSettings {...props} />
        </TabPane>
        {/* <TabPane
          disabled={!props.currentEdge}
          tab={
            <h4 className="tab-header alerts-container">
              <span>
                <CopyTwoTone />
              </span>
              Logs
            </h4>
          }
          key="5"
        ></TabPane> */}
      </Tabs>
    </div>
  );
};

HomePage.propTypes = {};

HomePage.defaultProps = {};
