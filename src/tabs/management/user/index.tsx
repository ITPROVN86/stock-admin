import { useState } from "react";
import {
  Table,
  Button,
  Select,
  Space,
  Tag,
  Avatar,
  Checkbox,
  CheckboxChangeEvent,
  Flex,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { UserDetailContent, UserStatisticComponent } from "./components";
import { UserOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { filterType } from "./constants";
import CustomModal from "../../../common/components/custom-modal";
import { UserInfo } from "../../../apis/users.api";
import moment from "moment";
import { useInfoAssetsUser, useInfoUsers } from "../../../hook/useInfoUsers";
import { blockUsers, unblockUsers } from "../../../apis/auth.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { filterUsersByKey, filterUsersByMultipleFields } from "../../../utils";
import { StyledTable } from "./style";

const { Option } = Select;

type OptionType = "All" | "Active User" | "Inactive User" | "Banned User";

export const UserManagement = () => {
  const queryClient = useQueryClient();
  const { data: users, isLoading } = useInfoUsers();

  const [uidSelected, setUidSelected] = useState<string>("");
  const { data: assets, isLoading: loadingAssetsUser } = useInfoAssetsUser(uidSelected);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<OptionType>("All");

  const [dataSearch, setDataSearch] = useState<UserInfo[] | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const showModal = (record: UserInfo) => {
    setSelectedUser(record);
    setUidSelected(record.id);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

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
      title: "UID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
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
      render: (role: string) => (
        <b style={{ color: role === "blocker" ? "red" : "inherit" }}>{role}</b>
      ),
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
            color = "green";
            break;
          case "pending":
            color = "yellow";
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
      render: (createdAt: Date) =>
        moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
    // {
    //   title: "Updated At",
    //   dataIndex: "updatedAt",
    //   key: "updatedAt",
    //   sorter: (a, b) =>
    //     new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    //   render: (updatedAt: Date) =>
    //     moment(updatedAt).format("YYYY-MM-DD HH:mm:ss"),
    // },
    // {
    //     title: 'Balance',
    //     dataIndex: 'balance',
    //     key: 'balance',
    // },
  ];
  const handleTableChange = (pagination: {
    current: number;
    pageSize: number;
  }) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDataSearch(users ? filterUsersByMultipleFields(users, value) : []);
  };

  const handleFilterUser = (value: OptionType) => {
    setSelectedFilter(value);
    switch (value) {
      case "Active User":
        setDataSearch(users ? filterUsersByKey(users, "state", "active") : []);
        break;
      case "Inactive User":
        setDataSearch(users ? filterUsersByKey(users, "state", "pending") : []);
        break;
      case "Banned User":
        setDataSearch(users ? filterUsersByKey(users, "role", "blocker") : []);
        break;
      case "All":
      default:
        setDataSearch(users);
        break;
    }
  };

  const blockMutation = useMutation({
    mutationFn: blockUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedUserIds([]);
      message.success("Users selected has been blocked");
    },
    onError: () => message.error("Failed to block users"),
  });

  const unblockMutation = useMutation({
    mutationFn: unblockUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setSelectedUserIds([]);
      message.success("Users selected has been active again");
    },
    onError: () => message.error("Failed to unblock users"),
  });

  const handleBlockUser = () => {
    blockMutation.mutate(selectedUserIds);
    setSelectedFilter("All");
    setDataSearch(undefined);
  };

  const handleUnblockUser = () => {
    unblockMutation.mutate(selectedUserIds);
    setSelectedFilter("All");
    setDataSearch(undefined);
  };
  return (
    <div>
      <Flex vertical gap={20}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600 }}>User Management</h1>
          
        </Space>
        <UserStatisticComponent />
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space>
            <Select
              value={selectedFilter}
              style={{ width: "10rem" }}
              onChange={(value: OptionType) => handleFilterUser(value)}
            >
              {filterType.map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
            <Search
              placeholder="Email or UID"
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              style={{ width: 200 }}
              onChange={onChange}
            />
            {selectedUserIds.length > 0 && (
              <Space>
                <Button
                  danger
                  type="primary"
                  onClick={handleBlockUser}
                  loading={blockMutation.isPending}
                >
                  Block User
                </Button>
                <Button
                  type="primary"
                  onClick={handleUnblockUser}
                  loading={unblockMutation.isPending}
                >
                  Unblock User
                </Button>
              </Space>
            )}
          </Space>

          <div>
            <span>
              Total: {users?.length.toLocaleString()} and showing {pageSize} /
              page
            </span>
          </div>
        </Space>
        <StyledTable>
          <Table
            rowKey={(record) => record.id}
            columns={columns}
            dataSource={dataSearch ? dataSearch.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) : users?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())}
            bordered
            size="small"
            className="custom-table"
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: dataSearch ? dataSearch.length : users?.length,
              onChange: (page, pageSize) =>
                handleTableChange({ current: page, pageSize }),
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "15", "20"],
              showTotal: (total: number) => `Total ${total} items`,
            }}
          />
        </StyledTable>
       
        {(selectedUser && assets && !loadingAssetsUser) && (
          <CustomModal
            title={`Portfolio of ${selectedUser.fullName}`}
            isModalOpen={isModalOpen}
            handleCancel={handleCancel}
            width={800}
            child={
              <UserDetailContent
                isLoading={loadingAssetsUser}
                uid={selectedUser.id}
                assets={assets}
              />
            }
          />
        )}
      </Flex>
    </div>
  );
};
