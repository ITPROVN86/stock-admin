import { Space } from "antd";
import BannerEventListComponent from "./BannerEventListComponent";

export const BannerEventManagement = () => {
  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Banner Event Management</h1>
      <BannerEventListComponent />
    </Space>
  );
};
