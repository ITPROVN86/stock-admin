import { Space } from "antd";
import ContestListComponent from "./ContestListComponent";
import { useInfoContests } from "../../../hook/useInfoContest";

export const ContestManagement = () => {
    const { data: contests,isLoading:loading } = useInfoContests();

    return (
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <h1 style={{ fontSize: 24, fontWeight: 600 }}>Contest Management</h1>
            {/* <ContestLineChartComponent contests={contests || []} loading={loading}/> */}
            <ContestListComponent contests={contests || []} loading={loading}/>
        </Space>
    );
};
