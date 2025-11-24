import React, { useEffect, useState } from "react";
import { Row, Col, Table, Statistic, Card } from "antd";
import {
  UserOutlined,
  TrademarkOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { UserDetailContentProps } from "./type";
import "./components.pcss";
import type { ColumnsType } from "antd/es/table";
import StatisticCard from "../../../common/components/statistic-card";
import { useInfoAllAssetsUser, useInfoUsers } from "../../../hook/useInfoUsers";
import { Portfolio } from "../../../apis/users.api";
import moment from "moment";
import { calculateTotalAssets, filterUsersByKey } from "../../../utils";

export const UserStatisticComponent: React.FC = () => {
  const { data: users, isLoading } = useInfoUsers();
  const { data: allAssetsUser, isLoading: loadingAllAssets } =
    useInfoAllAssetsUser();
  const totalUsers = users ? users.length.toLocaleString() : 0;
  const totalUsersActive = users
    ? filterUsersByKey(users, "state", "active").length.toLocaleString()
    : 0;
  console.log(allAssetsUser);

  const totalUsersWithTickers =
    !loadingAllAssets && allAssetsUser
      ? new Set(
          allAssetsUser.portfolios.map((asset) => asset.uid)
        ).size.toLocaleString()
      : 0;
  return (
    <Row gutter={[16, 16]} className="card-container">
      <Col span={8}>
        <StatisticCard
          icon={<UserOutlined />}
          value={totalUsers}
          loading={isLoading}
          label="Users in System"
        />
      </Col>
      <Col span={8}>
        <StatisticCard
          icon={<FireOutlined style={{ color: "red" }} />}
          value={totalUsersActive}
          loading={isLoading}
          label="Active Users"
        />
      </Col>
      <Col span={8}>
        <StatisticCard
          icon={<TrademarkOutlined style={{ color: "green" }} />}
          value={totalUsersWithTickers}
          loading={isLoading}
          label="Users with Tickers"
        />
      </Col>
    </Row>
  );
};

export const UserDetailContent: React.FC<UserDetailContentProps> = ({
  assets,
  isLoading,
  uid,
}) => {
  const [totalAssets, setTotalAssets] = useState<number>();
  const data = assets?.portfolios?.filter((ticker) => ticker.uid === uid);
  const dataWithKey = data?.map((item) => ({ ...item, key: item.id }));

  const fetchTotalAssets = async () => {
    const totalAssets = await calculateTotalAssets(assets.portfolios);
    setTotalAssets(totalAssets);
  };

  useEffect(() => {
    fetchTotalAssets();
  }, []);

  const columns: ColumnsType<Portfolio> = [
    {
      title: "Ticker",
      dataIndex: "ticker",
      key: "ticker",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Create At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (createdAt: Date) =>
        moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <div>
      <Row gutter={[16, 16]} className="wallet-info-row">
        <Col span={12}>
          <Card>
            <Statistic
              loading={isLoading}
              title="Total Assets"
              value={totalAssets}
              prefix="₫"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              loading={isLoading}
              title="Available Balance"
              value={assets.wallet[0]?.balance}
              prefix="₫"
            />
          </Card>
        </Col>
      </Row>
      <br></br>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={dataWithKey}
        bordered
        size="small"
        className="custom-table-ticker"
        rowClassName="table-row-hover"
        pagination={false}
      />
    </div>
  );
};
