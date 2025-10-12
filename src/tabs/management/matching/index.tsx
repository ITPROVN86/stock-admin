import { Space } from "antd";
import { useState, useMemo } from "react";
import MatchingListComponent from "./MatchingListComponent";
import { useInfoOrdersMatch } from "../../../hook/useInfoOrders";
import { MatchDateRange, OrderMatch } from "../../../apis/orders.api";
import { formatIdOrder } from "../../../utils";

export const MatchingManagement = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [searchUid, setSearchUid] = useState<string>("");
  const [dateRange, setDateRange] = useState<MatchDateRange>("all");

  const { data, isLoading } = useInfoOrdersMatch({ page, limit, searchUid, dateRange });

  const dataOrderMatchList: OrderMatch[] = useMemo(() => {
    const items = data?.items ?? [];
    return items.map((order) => ({
      ...order,
      id: formatIdOrder(order.id, "m"),
      key: formatIdOrder(order.id, "m"),
    }));
  }, [data]);

  const pagination = data?.pagination ?? { page, limit, total: 0, totalPages: 0 };

  const handleChangePage = (nextPage: number, nextLimit?: number) => {
    setPage(nextPage);
    if (nextLimit) setLimit(nextLimit);
  };

  const handleSearchUid = (value: string) => {
    setPage(1);
    setSearchUid(value);
  };

  const handleChangeDateRange = (value: MatchDateRange) => {
    setPage(1);
    setDateRange(value);
  };
  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Matching Management</h1>
      {/* <MatchingLineChartComponent
        data={dataOrderMatchList}
        loading={isLoading}
      /> */}
      <MatchingListComponent
        data={dataOrderMatchList}
        loading={isLoading}
        page={pagination.page}
        limit={pagination.limit}
        total={pagination.total}
        onChangePage={handleChangePage}
        onSearchUid={handleSearchUid}
        onChangeDateRange={handleChangeDateRange}
        currentDateRange={dateRange}
      />
    </Space>
  );
};
