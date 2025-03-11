import { useEffect, useState } from "react";
import LineChart from "../../../common/components/line-chart";
import {
  dayOrderData,
  monthOrderData,
  weekOrderData,
  yearOrderData,
} from "./sampleData";
import { OrderLineChartProps, SeriesData } from "./type";
import { Select, Spin, DatePicker } from "antd";
import {
  DAILY_DATA,
  MONTHLY_DATA,
  WEEKLY_DATA,
  YEARLY_DATA,
} from "./constants";
import { useInfoOrders } from "../../../hook/useInfoOrders";
import { OrderInfo } from "../../../apis/orders.api";
import { ApexOptions } from "apexcharts";
import moment from "moment";

const { Option } = Select;
const { RangePicker } = DatePicker;

const seriesData = {
  [DAILY_DATA]: dayOrderData,
  [WEEKLY_DATA]: weekOrderData,
  [MONTHLY_DATA]: monthOrderData,
  [YEARLY_DATA]: yearOrderData,
};

type IntervalType =
  | typeof DAILY_DATA
  | typeof WEEKLY_DATA
  | typeof MONTHLY_DATA
  | typeof YEARLY_DATA;

const LineStatusChartComponent = () => {
  const { data: orders, isLoading } = useInfoOrders();

  const [dateFilter, setDateFilter] = useState([null, null]);

  const [activeInterval, setActiveInterval] =
    useState<IntervalType>(DAILY_DATA);

  const handleDateChange = (dates: any) => {
    setDateFilter(dates);
  };

  const filterOrdersByInterval = (
    orders: OrderInfo[],
    interval: IntervalType
  ) => {
    let filteredOrders = orders;
    console.log(
      filteredOrders?.filter((order) => {
        const orderDate = moment(order.createdAt).format("YYYY-MM");
        return orderDate === moment().format("YYYY-MM");
      })
    );
    if (dateFilter[0] && dateFilter[1]) {
      filteredOrders = orders.filter((order) => {
        const orderDate = moment(order.createdAt);
        return orderDate.isBetween(dateFilter[0], dateFilter[1], null, "[]");
      });
    }
    switch (interval) {
      case DAILY_DATA:
        return filteredOrders?.filter((order) => {
          const orderDate = moment(order.createdAt).format("YYYY-MM-DD");
          return orderDate === moment().format("YYYY-MM-DD");
        });
      case WEEKLY_DATA:
        return filteredOrders?.filter((order) => {
          const orderDate = moment(order.createdAt).format("YYYY-WW");
          return orderDate === moment().format("YYYY-WW");
        });
      case MONTHLY_DATA:
        return filteredOrders?.filter((order) => {
          const orderDate = moment(order.createdAt).format("YYYY-MM");
          return orderDate === moment().format("YYYY-MM");
        });
      case YEARLY_DATA:
        return filteredOrders?.filter((order) => {
          const orderDate = moment(order.createdAt).format("YYYY");
          return orderDate === moment().format("YYYY");
        });
      default:
        return filteredOrders;
    }
  };

  const processOrderData = (
    orders: OrderInfo[],
    interval: IntervalType
  ): OrderLineChartProps => {
    let filteredOrders = filterOrdersByInterval(orders, interval);
    if (dateFilter[0] && dateFilter[1]) {
      filteredOrders = orders.filter((order) => {
        const orderDate = moment(order.createdAt);
        return orderDate.isBetween(dateFilter[0], dateFilter[1], null, "[]");
      });
    }

    const dates = filteredOrders?.map((order) =>
      new Date(order.createdAt).toISOString()
    );
    const uniqueDates = [...new Set(dates)].sort();

    if (uniqueDates.length === 0) {
      return {
        series: [
          { name: "Pending", data: [] },
          { name: "Partially filled", data: [] },
          { name: "Completed", data: [] },
          { name: "Cancelled", data: [] },
        ],
        options: {
          chart: { height: 350, type: "area", toolbar: { show: false } },
          markers: { size: 4 },
          colors: ["#39afd1", "#f77e53", "#fcb92c", "#e3eaef"],
          fill: {
            type: "gradient",
            gradient: {
              shadeIntensity: 1,
              opacityFrom: 0.3,
              opacityTo: 0.4,
              stops: [0, 90, 100],
            },
          },
          dataLabels: { enabled: false },
          stroke: { curve: "smooth", width: 2 },
          xaxis: { type: "datetime", categories: [] },
          tooltip: { x: { format: "dd/MM/yy HH:mm:ss" } },
        },
      };
    }

    const statusData: { [key: string]: number[] } = {
      Pending: new Array(uniqueDates.length).fill(0),
      "Partially filled": new Array(uniqueDates.length).fill(0),
      Completed: new Array(uniqueDates.length).fill(0),
      Cancelled: new Array(uniqueDates.length).fill(0),
    };

    filteredOrders?.forEach((order) => {
      const orderDate = new Date(order.createdAt).toISOString();
      const dateIndex = uniqueDates.indexOf(orderDate);

      if (dateIndex !== -1) {
        const statusKey =
          order.status === "partially_filled"
            ? "Partially filled"
            : order.status.charAt(0).toUpperCase() + order.status.slice(1);
        statusData[statusKey][dateIndex]++;
      }
    });

    const series: SeriesData[] = [
      { name: "Pending", data: statusData["Pending"] },
      { name: "Partially filled", data: statusData["Partially filled"] },
      { name: "Completed", data: statusData["Completed"] },
      { name: "Cancelled", data: statusData["Cancelled"] },
    ];

    const categories = uniqueDates;
    const options: ApexOptions = {
      chart: {
        height: 350,
        type: "area",
        toolbar: { show: false },
      },
      markers: { size: 4 },
      colors: ["#ff9800", "#2196f3", "#4caf50", "#f44336"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.4,
          stops: [0, 90, 100],
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        type: "datetime",
        categories: categories,
      },
      tooltip: {
        x: { format: "dd/MM/yy HH:mm:ss" },
      },
    };

    return { series, options };
  };
  const [formatedData, setFormatedData] = useState<OrderLineChartProps>(processOrderData(orders as OrderInfo[], activeInterval));
  const updateChartInterval = (interval: keyof typeof seriesData) => {
    setActiveInterval(interval);
    setFormatedData(processOrderData(orders as OrderInfo[], interval));
  };

  useEffect(() => {
    if(!isLoading) {
      setFormatedData(processOrderData(orders as OrderInfo[], activeInterval));
    }
  },[isLoading])

  return (
    <div
      style={{
        padding: 24,
        backgroundColor: "white",
        borderRadius: 10,
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <Select
        onChange={(value) =>
          updateChartInterval(value as keyof typeof seriesData)
        }
        style={{ width: "10rem" }}
        value={activeInterval}
      >
        {Object.keys(seriesData).map((interval) => (
          <Option key={interval} value={interval}>
            {interval}
          </Option>
        ))}
      </Select>

      <RangePicker onChange={handleDateChange} style={{ marginLeft: 10 }} />

      <Spin spinning={isLoading}>
        {!isLoading && (
          <LineChart key={activeInterval} formatedData={formatedData} />
        )}
      </Spin>
    </div>
  );
};

export default LineStatusChartComponent;
