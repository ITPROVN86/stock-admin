import { AppHeader } from "./style";
import { AppButton } from "../app-button";
import { UserOutlined, HomeOutlined, LogoutOutlined } from "@ant-design/icons";
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