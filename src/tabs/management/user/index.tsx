import { useState } from "react";
import {
  Table,
  Button,
  Select,
  Input,
  Space,
  Tag,
  Avatar,
  Checkbox,
  CheckboxChangeEvent,
  Flex,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { SearchProps } from "./type";
import "./style.pcss";
import { UserDetailContent, UserStatisticComponent } from "./components";
import { UserOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { tickers } from "./sampleData";
import { filterType } from "./constants";
import CustomModal from "../../../common/components/custom-modal";
import { UserInfo } from "../../../apis/users.api";
import moment from "moment";
import { useInfoUsers } from "../../../hook/useInfoUsers";

const { Option } = Select;

export const UserManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const { data: users, isLoading } = useInfoUsers();
  const showModal = (record: UserInfo) => {
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const handleCheckboxChange = (e: CheckboxChangeEvent, userId: string) => {
    if (e.target.checked) {
      setSelectedUserIds((prev) => [...prev, userId]);
    } else {
      setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
    }
  };
  const columns: ColumnsType<UserInfo> = [
    {
      title: "",
      dataIndex: "checkbox",
      key: "id",
      render: (_e: React.ChangeEvent<HTMLInputElement>, record: UserInfo) => (
        <Checkbox
          key={record.id}
          onChange={(e) => handleCheckboxChange(e, record.id)}
          checked={selectedUserIds.includes(record.id)}
        />
      ),
      width: 20,
    },
    {
      title: "Name",
      dataIndex: "fullname",
      key: "fullname",
      onCell: (record: UserInfo) => ({
        onClick: () => showModal(record),
      }),
      render: (fullname: string) => (
        <div>
          <Space className="clickable-row" title="Click to view details">
            <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
            {fullname}
          </Space>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "CIC",
      dataIndex: "cic",
      key: "cic",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (dob: Date) => moment(dob).format("YYYY-MM-DD"),
    },
    {
      title: "Campus",
      dataIndex: "campus",
      key: "campus",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (status: string) => {
        let color: string;
        switch (status) {
          case "active":
            color = "blue";
            break;
          case "inactive":
            color = "red";
            break;
          case "Not started":
            color = "default";
            break;
          case "Waiting":
            color = "gold";
            break;
          default:
            color = "default";
        }
        return (
          <Tag color={color} style={{ cursor: "pointer" }}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createdAt: Date) =>
        moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (updatedAt: Date) =>
        moment(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    // {
    //     title: 'Balance',
    //     dataIndex: 'balance',
    //     key: 'balance',
    // },
  ];

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <div>
      <Flex vertical gap={20}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>User Management</h1>
          <Space>
            <Button type="default">Download report</Button>
          </Space>
        </Space>
        <UserStatisticComponent />
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space>
            <Select defaultValue="All User" style={{ width: "10rem" }}>
              {filterType.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
            <Search
              placeholder=" Search user"
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              style={{ width: 200 }}
              onSearch={onSearch}
            />
            {selectedUserIds.length > 0 && (
              <Button danger type="primary">
                Ban User
              </Button>
            )}
          </Space>

          <div>
            <span>Total: {users?.length} and showing </span>
            <Input
              style={{ width: 50, textAlign: "center", margin: "0 8px" }}
              defaultValue={10}
            />
            <span>page</span>
          </div>
        </Space>

        <Table
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={users}
          bordered
          size="small"
          className="custom-table"
          loading={isLoading}
        />
        {selectedUser && (
          <CustomModal
            title={`Portfolio of user ${selectedUser.fullname}`}
            isModalOpen={isModalOpen}
            handleCancel={handleCancel}
            width={800}
            child={
              <UserDetailContent
                tickers={tickers.filter(
                  (ticker) => ticker.uid === selectedUser.id
                )}
              />
            }
          />
        )}
      </Flex>
    </div>
  );
};
