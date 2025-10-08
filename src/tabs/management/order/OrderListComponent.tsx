import { Button, Input, Select, Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { SearchProps } from "antd/es/input";
import { OrderInfo } from "../../../apis/orders.api";
import moment from "moment";
import { useEffect, useState } from "react";
import styled from 'styled-components';

 const StyledTableOrder = styled.div`
  .ant-table-cell {
    font-size: 0.8rem; /* Thay đổi giá trị theo ý bạn */
  }

  .clickable-row {
    cursor: pointer;
  }

  .ant-table {
    min-height: 17rem;
  }
`;
const { Option } = Select;

type Props = {
  data: OrderInfo[];
  loading: boolean;
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (pageSize: number) => void;
  selectedType?: string;
  selectedSide?: string;
  selectedStatus?: string;
  onTypeChange?: (v: string) => void;
  onSideChange?: (v: string) => void;
  onStatusChange?: (v: string) => void;
  search?: string;
  onSearchChange?: (v: string) => void;
};

const ListComponent: React.FC<Props> = (props) => {
  const { data, loading, total, page = 1, limit = 10, onPageChange, onLimitChange, selectedType = "All", selectedSide = "All", selectedStatus = "All", onTypeChange, onSideChange, onStatusChange, search = "", onSearchChange } = props;
  const [filteredData, setFilteredData] = useState<OrderInfo[]>(data);

  useEffect(() => {
    if (!loading) {
      setFilteredData(data);
    }
  }, [data, loading])

  const columns: ColumnsType<OrderInfo> = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "UID",
      dataIndex: "uid",
      key: "uid",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ticker",
      dataIndex: "ticker",
      key: "ticker",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        let color: string;
        switch (type) {
          case "limit":
            color = "red";
            break;
          case "market":
            color = "green";
            break;
          default:
            color = "default";
        }
        return (
          <Tag color={color} style={{ cursor: "pointer" }}>
            {type}
          </Tag>
        );
      },
    },
    {
      title: "Side",
      dataIndex: "side",
      key: "side",
      render: (side: string) => {
        let color: string;
        switch (side) {
          case "buy":
            color = "red";
            break;
          case "sell":
            color = "green";
            break;
          default:
            color = "default";
        }
        return (
          <Tag color={color} style={{ cursor: "pointer" }}>
            {side}
          </Tag>
        );
      },
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status?: string) => {
        let color: string;
        switch (status) {
          case "pending":
            color = "blue";
            break;
          case "partially_filled":
            color = "red";
            break;
          case "completed":
            color = "green";
            break;
          case "cancelled":
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
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createAt: Date) =>
        moment(createAt).format("YYYY-MM-DD HH:mm:ss"),
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
  ];

  const onSearch: SearchProps["onSearch"] = (value: string) =>
    onSearchChange?.(value);

  return (
    <div
      style={{
        marginTop: 10,
        padding: 24,
        backgroundColor: "white",
        borderRadius: 10,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 600 }}> Order List</h3>
        <Space>
          <Button type="default">Download report</Button>
        </Space>
      </Space>
      <Space
        style={{
          marginBottom: 16,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Space>
          <Space>
            <span style={{ minWidth: 40 }}>Type</span>
            <Select
              value={selectedType}
              onChange={onTypeChange}
              style={{ width: "6rem" }}
            >
              {["All", "limit", "market"].map((type) => (
                <Option key={type} value={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Space>
          <Space>
            <span style={{ minWidth: 40 }}>Side</span>
            <Select
              value={selectedSide}
              onChange={onSideChange}
              style={{ width: "6rem" }}
            >
              {["All", "buy", "sell"].map((side) => (
                <Option key={side} value={side}>
                  {side}
                </Option>
              ))}
            </Select>
          </Space>
          <Space>
            <span style={{ minWidth: 52 }}>Status</span>
            <Select
              value={selectedStatus}
              onChange={onStatusChange}
              style={{ width: "8rem" }}
            >
              {["All", "pending", "partially_filled", "completed", "cancelled"].map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Space>
          <Input.Search
            placeholder=" Search by Order ID or UID"
            style={{ width: 300 }}
            value={search}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onSearch={onSearch}
          />
        </Space>

        <div>
          <span>Total: {(total ?? filteredData?.length)?.toLocaleString()} and showing </span>
          <Input
            style={{ width: 60, textAlign: "center", margin: "0 8px" }}
            value={limit}
            onChange={(e) => {
              const v = parseInt(e.target.value || '0', 10);
              if (!Number.isNaN(v) && v > 0) onLimitChange?.(v);
            }}
          />
          <span>per page</span>
        </div>
      </Space>
      <StyledTableOrder>
        <Table
          loading={loading}
          columns={columns}
          dataSource={filteredData}
          bordered
          size="small"
          className="custom-table"
          pagination={{
            current: page,
            pageSize: limit,
            total: total ?? filteredData.length,
            showSizeChanger: true,
            pageSizeOptions: [10, 12, 20, 50, 100].map(String),
            onChange: (p, ps) => {
              onPageChange?.(p);
              if (ps !== limit) onLimitChange?.(ps);
            },
          }}
        />
      </StyledTableOrder>
      
    </div>
  );
};

export default ListComponent;