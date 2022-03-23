import { useState, useEffect } from "react";
import { List, Empty } from "antd";
import { SettingItem } from "../../components/home/SettingItem";
import useEdgeMutation from "../../graphql/useEdgesMutation";
import { UpgraderItem } from "../../components/home/UpgradeItem";

const data = ["edge-name", "compact", "upgrade"];

export const Settings = (props) => {
  const { currentEdge } = props;
  const { updateEdge } = useEdgeMutation();
  const [edgeName, setEdgeName] = useState("");
  const [compactSize, setCompactSize] = useState("");
  const [upgrader, setUpgrader] = useState({upgradeTime:"00:00", upgradeDay:"0"});
  useEffect(() => {
    if (currentEdge) {
      console.log(currentEdge)
      setEdgeName(currentEdge.edgeName);
      setCompactSize(currentEdge.compactSize);
      setUpgrader({upgradeTime:currentEdge.upgradeTime || "00:00", upgradeDay:currentEdge.upgradeDay || "0"})
    }
  }, [currentEdge]);

  if (!currentEdge) {
    return <Empty />;
  }

  const Name = () => (
    <SettingItem
      title={"Edge Name"}
      name={"edgeName"}
      description={
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries"
      }
      label={"Set a name for your edge broker"}
      placeholder="Villa's Edge device"
      inputType="text"
      value={edgeName}
      onEditEnded={(res) => {
        setEdgeName(res.value);
        updateEdge(currentEdge, { [res.key]: res.value });
      }}
    />
  );

  const Compact = () => (
    <SettingItem
      name={"compactSize"}
      title={"Compact"}
      description={
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum "
      }
      label={"Max size to compact in MB"}
      placeholder="25MB"
      inputType="number"
      value={compactSize}
      onEditEnded={(res) => {
        setCompactSize(res.value);
        updateEdge(currentEdge, { [res.key]: res.value });
      }}
    />
  );

  const Upgrader = () => (
    <UpgraderItem
      description="It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum "
      title="Check for the Upgrade"
      label="Check for upgrade for every"
      value={upgrader}
      onEditEnded={(res) => {
        setUpgrader(res)
        updateEdge(currentEdge, res);
      }}
    />
  );

  return (
    <List
      className="settings-list-container"
      size="large"
      dataSource={data}
      renderItem={(item) => {
        switch (item) {
          case "edge-name":
            return (
              <List.Item>
                <Name />
              </List.Item>
            );
          case "compact":
            return (
              <List.Item>
                <Compact />
              </List.Item>
            );
          case "upgrade":
            return (
              <List.Item>
                <Upgrader />
              </List.Item>
            );
          default:
            return null;
        }
      }}
    />
  );
};
