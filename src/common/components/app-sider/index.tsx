import { Menu } from "antd";
import {
  OrderedListOutlined,
  SoundOutlined,
  SyncOutlined,
  TrophyOutlined,
  UserOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { StyledSider } from "./style";
import { Link, useLocation } from "react-router-dom";
import { onScrollToTop } from "../../../utils";

const menuItems = [
  {
    key: "1",
    label: (
      <Link onClick={() => onScrollToTop("create-form")} to="/users">
        Manage Users
      </Link>
    ),
    path: "/users",
    icon: <UserOutlined />,
  },
  {
    key: "2",
    label: (
      <Link onClick={() => onScrollToTop()} to="/order">
        Manage Orders
      </Link>
    ),
    path: "/order",
    icon: <OrderedListOutlined />,
  },
  {
    key: "3",
    label: (
      <Link onClick={() => onScrollToTop()} to="/matching">
        Manage Orders Match
      </Link>
    ),
    path: "/matching",
    icon: <SyncOutlined />,
  },
  {
    key: "4",
    label: (
      <Link onClick={() => onScrollToTop()} to="/contest">
        Manage Contests
      </Link>
    ),
    path: "/contest",
    icon: <TrophyOutlined />,
  },
  {
    key: "5",
    label: (
      <Link onClick={() => onScrollToTop()} to="/banner-event">
        Manage Banner Events
      </Link>
    ),
    path: "/banner-event",
    icon: <SoundOutlined />,
  },
  {
    key: "6",
    label: (
      <Link onClick={() => onScrollToTop()} to="https://cloud.umami.is/analytics/us/websites/9d154b8a-b69a-4912-a2a0-4f6d8af76660" target="_blank">
        Analytics
      </Link>
    ),
    path: "/analytics",
    icon: <BarChartOutlined  />,
  },
];

const AppSider = ({ isSidebarOpen }: { isSidebarOpen: boolean }) => {
  const location = useLocation();

  const selectedKey =
    menuItems.find((item) => item.path === location.pathname)?.key || "";
  return (
    <StyledSider
      collapsed={!isSidebarOpen}
      collapsedWidth={0}
      width={300}
      hidden={!selectedKey}
    >
      <div className="menu-section">
        <Menu
          mode="vertical"
          selectable={false}
          items={menuItems}
          selectedKeys={[selectedKey]}
        />
      </div>
    </StyledSider>
  );
};

export default AppSider;
