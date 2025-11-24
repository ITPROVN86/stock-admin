import { Avatar, Space, Table, Empty, Skeleton, Tooltip } from "antd";
import {  RankListComponentProps } from "../type";
import { ColumnsType } from "antd/es/table";
import {  TopUser } from "../../../../apis/contests.api";
import styled from 'styled-components';
import moment from "moment";

const StyledTableRank = styled.div`
  .ant-table-cell {
    font-size: 0.8rem;
  }
  .clickable-row {
    cursor: pointer;
  }
  .ant-table {
    min-height: 17rem;
  }
`;
const columns: ColumnsType<TopUser> = [
  {
    title: 'User Id',
    dataIndex: 'uid',
    key: 'uid',
    render: (fullName: string) => (
      <Space className="clickable-row" title="Click to view details">
        <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
        {fullName}
      </Space>
    ),
  },
  {
    title: 'Full Name',
    dataIndex: 'fullName',
    key: 'fullName',
  },

  {
    title: 'Rank',
    dataIndex: 'rank',
    key: 'rank',
    render:(rank:number)=>{return  (
      <Tooltip title={`Rank ${rank}`}>
      <span
        style={{
          color: "black",
          padding: "0.1rem 0.4rem",
          backgroundColor: {
            1: "gold",    // Gold for 1st place
            2: "silver",  // Silver for 2nd place
            3: "#cd7f32", // Bronze for 3rd place
          }[rank] || "#F4F4F4", // Default to #F4F4F4 if rank > 3
          borderRadius: "1.2rem",
          fontWeight: 600, // Makes text stand out
        }}
      >
        {rank}
      </span>
    </Tooltip>)}
  },
  {
    title: 'Created At',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (createdAt: string) =>moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    title: 'Increased Amount',
    dataIndex: 'increasedAmount',
    key: 'increasedAmount',
    render: (increasedAmount: number) => (
      <span style={{ color: increasedAmount > 0 ? 'green' : 'red' }}>
        {increasedAmount > 0 ? '+' : ''}
        {increasedAmount}
      </span>
    ),
  },
  {
    title: 'ROIC',
    dataIndex: 'ROIC',
    key: 'ROIC',
    render: (ROIC: number) => (
      <span style={{ color: ROIC > 0 ? 'green' : 'red' }}>
      { Math.abs(ROIC).toFixed(2) + '%'}
      </span>)
  },
];

const RankListComponent = ({ topUsers, loading }: RankListComponentProps) => {

  return (
    <div
      style={{
        marginTop: '0.55rem',
        padding: 24,
        backgroundColor: 'white',
        borderRadius: 10,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }}
    >
      <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Top Users</h3>
      
      </Space>

      {loading ? (
        <Skeleton active />
      ) : topUsers.length === 0 ? (
        <Empty description="No top users found" />
      ) : (
        <>
          
          <StyledTableRank>
            <Table
              rowKey={(record) => record.contestId.toString()}
              columns={columns}
              dataSource={topUsers}
              bordered
              size="small"
              className="custom-table"
            />
          </StyledTableRank>
        </>
      )}
    </div>
  );
};

export default RankListComponent;
