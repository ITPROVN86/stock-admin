import { Col, Row, Space } from "antd";
import OrderListComponent from "./OrderListComponent";
import OrderLineChartComponent from "./OrderLineChartComponent";
import OrderPieChartComponent from "./OrderPieChartComponent";
import { useInfoOrders } from "../../../hook/useInfoOrders";
import { filterOrdersByKey } from "../../../utils/filterDataByProperties";
import { OrderInfo } from "../../../apis/orders.api";

const keysFilter = ["completed", "cancelled", "pending", "partially_filled"];

export const OrderManagement = () => {
  const { data: orders, isLoading } = useInfoOrders();
  const dataOrderPieChart = keysFilter.map((key) => {
    return {
      name: key,
      value: filterOrdersByKey(orders, "status", key).length,
    };
  });
  const dataOrderList: OrderInfo[] = orders ? orders?.map((order) => {
    return {
      ...order,
      id: `O${order.id.toString().padStart(5, "0")}`,
    };
  }) : [];
  return (
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>Order Management</h1>
      <Row gutter={16}>
        <Col span={8}>
          <OrderPieChartComponent data={dataOrderPieChart} />
        </Col>
        <Col span={16}>
          <OrderLineChartComponent />
        </Col>
      </Row>
      <OrderListComponent data={dataOrderList} loading={isLoading}/>
    </Space>
  );
};
