import { Space } from "antd";
import { useState } from "react";
import OrderListComponent from "./OrderListComponent";
import { useInfoOrders } from "../../../hook/useInfoOrders";
import { OrderInfo } from "../../../apis/orders.api";
import { formatIdOrder } from "../../../utils";

export const OrderManagement = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [side, setSide] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const { data, isLoading, isFetching } = useInfoOrders({
    limit,
    page,
    side: side === "All" ? undefined : (side as any),
    type: type === "All" ? undefined : (type as any),
    status: status === "All" ? undefined : (status as any),
    search: search || undefined,
  });
  const orders = data?.items;

  const dataOrderList: OrderInfo[] = Array.isArray(orders)
    ? orders.filter(order => order !== null).map((order) => {
        return {
          ...order,
          id: formatIdOrder(order?.id, "o"),
          key: formatIdOrder(order?.id, "o"),
        };
      })
    : [];

  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Order Management</h1>
      <OrderListComponent 
        data={dataOrderList}
        loading={isLoading || isFetching}
        total={data?.pagination?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={(p) => setPage(p)}
        onLimitChange={(ps) => { setPage(1); setLimit(ps); }}
        selectedType={type}
        selectedSide={side}
        selectedStatus={status}
        onTypeChange={(v) => { setPage(1); setType(v); }}
        onSideChange={(v) => { setPage(1); setSide(v); }}
        onStatusChange={(v) => { setPage(1); setStatus(v); }}
        search={search}
        onSearchChange={(v) => { setPage(1); setSearch(v); }}
      />
    </Space>
  );
};
