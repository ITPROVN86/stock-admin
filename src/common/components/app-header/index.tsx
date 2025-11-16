import { AppHeader } from "./style";
import { AppButton } from "../app-button";
import { UserOutlined, HomeOutlined, LogoutOutlined, BarChartOutlined } from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <AppHeader>
      <div className="header-title" onClick={toggleSidebar}>
        <HomeOutlined style={{ marginRight: 8 }} />
        Dashboard
      </div>

      <div className="app-header--right">
        {isLoggedIn ? (
          <>
            <AppButton icon={<UserOutlined />}>Admin</AppButton>
            <AppButton onClick={() => window.open("https://cloud.umami.is/analytics/us/websites/9d154b8a-b69a-4912-a2a0-4f6d8af76660", "_blank")} icon={<BarChartOutlined />} style={{ width: 100 }}>Analytics</AppButton>
            <AppButton
              icon={<LogoutOutlined />}
              onClick={logout}
              style={{ width: 100 }}
            >
              Logout
            </AppButton>
          </>
        ) : (
          <AppButton style={{ width: 100 }}>Login</AppButton>
        )}
      </div>
    </AppHeader>
  );
};

export default Header;