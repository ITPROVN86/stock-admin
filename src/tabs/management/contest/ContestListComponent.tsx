
import {   message, Skeleton, Tag } from "antd";
import { Button, Dropdown, Input, MenuProps, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { SearchProps } from "antd/es/input";
import { useEffect, useState } from "react";
import { AuditOutlined, DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { filterType } from "./constants";
import CustomModal from "../../../common/components/custom-modal";
import ContestForm from "../../../common/components/contest-form";
import ContestDetailComponent from "./ContestDetailComponent";
import { Contest } from "../../../apis/contests.api";
import { useCreateContest, useDeleteContest, useUpdateContest } from "../../../hook/useInfoContest";
import styled from 'styled-components';
import { filterContestsByKey, getError } from "../../../utils";
import moment from "moment";
import { ContestDetailProps } from "./type";


const StyledTableContest = styled.div`
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
const ListComponent: React.FC<ContestDetailProps> = (props) => {
    const { contests, loading } = props;
    const [filteredContests, setFilteredContests] = useState<Contest[]>(contests);
    const [filterOption, setFilterOption] = useState<string>("All");
    const [contestsSearch, setContestsSearch] = useState<Contest[]>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
    const { mutate: mutateCreate } = useCreateContest();
    const { mutate: mutateUpdate } = useUpdateContest();
    const { mutate: mutateDelete } = useDeleteContest();
    const [dataSource, setDataSource] = useState<Contest[]>(filteredContests);
    const [loadAgain, setLoadAgain] = useState(false);
    useEffect(() => {
        if (!loading) {
            setFilteredContests(contests || []);
            setDataSource(contests);
        }
        if (contests.length === 0) return;

        const now = new Date().getTime();
        let nextUpdateTime = Infinity;
    
        contests.forEach((contest) => {
            const startTime = new Date(contest.startDateTime).getTime();
            const endTime = new Date(contest.endDateTime).getTime();
    
            if (startTime > now) {
                nextUpdateTime = Math.min(nextUpdateTime, startTime);
            }
            if (endTime > now) {
                nextUpdateTime = Math.min(nextUpdateTime, endTime);
            }
        });
    
        if (nextUpdateTime !== Infinity) {
            const delay = nextUpdateTime - now;
            const timer = setTimeout(() => {
               setLoadAgain(!loadAgain);
            }, delay);
    
            return () => clearTimeout(timer); // Cleanup timer khi unmount
        }
        setLoadAgain(!loadAgain);
    }, [contests, loading]);


    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showUpdateModal = (record: Contest) => {
        setIsUpdateModalOpen(true);
        setSelectedContest(record);
    };

    const handleUpdateModalCancel = () => {
        setIsUpdateModalOpen(false);
        setSelectedContest(null);
    };

    const showDetailModal = (record: Contest) => {
        setIsDetailModalOpen(true);
        setSelectedContest(record);
    };

    const handleDetailModalCancel = () => {
        setIsDetailModalOpen(false);
        setSelectedContest(null);
    };

    const handleCreateContest = (values: any, form: any) => {
        const contest: Contest = {
            contestId: null,
            contestName: values.contestName,
            startDateTime: new Date(values.contestDuration[0]),
            endDateTime: new Date(values.contestDuration[1]),
            banner: values.banner,
            maxParticipants: values.maxParticipants,
        };
        mutateCreate(contest, {
            onSuccess: () => {
                message.success("Contest created successfully!");
                setIsModalOpen(false); // Đóng modal sau khi tạo thành công
                form.resetFields(); 
                
            },
            onError: (error) => {
                message.error("Failed to create contest: " + getError(error));
                form.resetFields();
                setIsModalOpen(false);
            },
        });
    };


    const handleUpdateContest = (values: any) => {
        const contest: Contest = {
            contestId: selectedContest?.contestId || null,
            contestName: values.contestName,
            startDateTime: new Date(values.contestDuration[0]),
            endDateTime: new Date(values.contestDuration[1]),
            banner: values.banner,
            maxParticipants: values.maxParticipants,
        };
        mutateUpdate(contest, {
            onSuccess: () => {
                message.success("Contest updated successfully!");
                setIsUpdateModalOpen(false); // Đóng modal sau khi cập nhật thành công
                // form.resetFields(); // Clear các field trong form
            },
            onError: (error) => {
                message.error("Failed to update contest: " + error.message);
                setIsUpdateModalOpen(false); // Đóng modal sau khi cập nhật thành công
            },
        });
    };

    const handleDeleteContest = (id: number) => {
        mutateDelete(id, {
            onSuccess: () => {
                message.success("Contest deleted successfully!");
            },
            onError: (error) => {
                message.error("Failed to delete contest: " + error.message);
            },
        });
    };
    const handleFilterChange = (value: string) => {
        setFilterOption(value);
        let filteredContests: Contest[] = [];

        switch (value) {
            case "Today":
                filteredContests = contests.filter(contest =>
                    moment(contest.startDateTime).isSame(moment(), "day")
                );
                break;
            case "This Week":
                filteredContests = contests.filter(contest =>
                    moment(contest.startDateTime).isSame(moment(), "week")
                );
                break;
            case "Last Week":
                filteredContests = contests.filter(contest =>
                    moment(contest.startDateTime).isSame(moment().subtract(1, "week"), "week")
                );
                break;
            case "This Month":
                filteredContests = contests.filter(contest =>
                    moment(contest.startDateTime).isSame(moment(), "month")
                );
                break;
            case "Last Month":
                filteredContests = contests.filter(contest =>
                    moment(contest.startDateTime).isSame(moment().subtract(1, "month"), "month")
                );
                break;
            case "This Year":
                filteredContests = contests.filter(contest =>
                    moment(contest.startDateTime).isSame(moment(), "year")
                );
                break;
            case "Last Year":
                filteredContests = contests.filter(contest =>
                    moment(contest.startDateTime).isSame(moment().subtract(1, "year"), "year")
                );
                break;
            case "All":
                filteredContests = contests;
                break;
            default:
                filteredContests = contests;
        }

        setFilteredContests(filteredContests);
        setDataSource(filteredContests);
    };
    const handleTableChange = (pagination: {
        current: number;
        pageSize: number;
    }) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const columns: ColumnsType<Contest> = [
        {
            title: 'Contest ID',
            dataIndex: 'contestId',
            key: 'contestId',
        },
        {
            title: 'Contest Name',
            dataIndex: 'contestName',
            key: 'contestName',
            render: (contestName: string) => {
                return <Space title='Click to view details' style={{ cursor: 'pointer' }}><AuditOutlined />{contestName}</Space>;
            },
            onCell: (record: Contest) => ({
                onClick: () => showDetailModal(record),
            }),
        },
        {
            title: 'Start Time',
            dataIndex: 'startDateTime',
            key: 'startDateTime',
            sorter: (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
            render: (startDateTime: string) => moment(startDateTime).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: 'End Time',
            dataIndex: 'endDateTime',
            key: 'endDateTime',
            sorter: (a, b) => new Date(a.endDateTime).getTime() - new Date(b.endDateTime).getTime(),
            render: (endDateTime: Date) => moment(endDateTime).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: 'Max Participants',
            dataIndex: 'maxParticipants',
            key: 'maxParticipants',
            render: (maxParticipants: number) => maxParticipants > 0 ? maxParticipants.toLocaleString() : 'Unlimited',
        },
        {
            title: 'Banner',
            dataIndex: 'banner',
            key: 'banner',
            render: (banner: string) => <a href={banner}><img src={banner} alt="banner" style={{ width: 100, height: 40 }} /></a>,
        },
        {
            title: 'Status',
            dataIndex: 'startDateTime',
            key: 'startDateTime',
            render: (_: any, record: Contest) => {
                const { startDateTime, endDateTime } = record;
                const now = new Date();
                const start = new Date(startDateTime);
                const end = new Date(endDateTime);

                const statusMap: { [key: string]: { color: string; value: string } } = {
                    ended: { color: 'red', value: 'Ended' },
                    ongoing: { color: 'green', value: 'Ongoing' },
                    upcoming: { color: 'yellow', value: 'Upcoming' },
                    unknown: { color: 'default', value: 'Unknown' }
                };

                const status =
                    end < now ? 'ended' :
                        start <= now && end >= now ? 'ongoing' :
                            start > now ? 'upcoming' :
                                'unknown';

                return <Tag color={statusMap[status].color}>{statusMap[status].value}</Tag>;
            }
        },
        {
            title: '',
            dataIndex: 'startDateTime',
            key: 'startDateTime',
            width: 20,
            render: (_: any, record: Contest) => {
                const isDisabled = new Date(_) <= new Date();
                const menuItems: MenuProps['items'] = [
                    {
                        key: '1',
                        disabled: isDisabled,
                        label: "Edit",
                        icon: <EditOutlined />,
                        onClick: () => {
                            if (!isDisabled) showUpdateModal(record);
                        },
                    },
                    {
                        key: '2',
                        danger: true,
                        disabled: isDisabled,
                        label: "Delete",
                        icon: <DeleteOutlined />,
                        onClick: () => {
                            if (!isDisabled) handleDeleteContest(record.contestId!);
                        },
                    },
                ];
                return (
                    <Dropdown menu={{ items: menuItems }} placement="bottomLeft">
                        {/* <MoreOutlined /> */}
                        <Button type="default" shape="circle" icon={<MoreOutlined />} />
                    </Dropdown>
                );
            },
        },
    ];
    const handleSearch = (value: string) => {
        setContestsSearch(filteredContests ? filterContestsByKey(filteredContests, "contestName", value, true) : []);
        setDataSource(contestsSearch!);
    }
    const onSearch: SearchProps["onSearch"] = (value) => {
        handleSearch(value);
    };

    return (
        <div style={{ marginTop: '0.55rem', padding: 24, backgroundColor: 'white', borderRadius: 10, boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: 18, fontWeight: 600 }}> Contest List</h3>
            </Space>

            <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
                <Space>
                    <Select value={filterOption} onChange={handleFilterChange} defaultValue="Today" style={{ width: '10rem' }}>
                        {filterType.map(type => <Option key={type} value={type}>{type}</Option>)}
                    </Select>
                    <Input.Search placeholder=" Search contest" style={{ width: 200 }}
                        onSearch={onSearch}
                    />
                    <Button type="default" style={{ backgroundColor: 'rgb(252, 125, 52)', borderRadius: 'rgb(252, 125, 52)', color: 'white' }} onClick={showModal}>Create Contest</Button>
                </Space>

                <div>
                    <span>Total: {dataSource?.length.toLocaleString()} and showing {pageSize} / page </span>
                </div>
            </Space>
            <StyledTableContest>
                {loadAgain&&loading ?
                    (<Skeleton active />) : (
                        <Table
                            rowKey={(record) => record.contestId!.toString()}
                            columns={columns}
                            dataSource={dataSource}
                            bordered
                            size="small"
                            className="custom-table"
                            loading={loading}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: dataSource ? dataSource.length : 0,
                                onChange: (page, pageSize) =>
                                    handleTableChange({ current: page, pageSize }),
                                showSizeChanger: true,
                                pageSizeOptions: ["5", "10", "15", "20"],
                                showTotal: (total: number) => `Total ${total} items`,
                            }} />
                    )}
            </StyledTableContest>
            <CustomModal key='create-contest'
                title={`Create new contest`}
                isModalOpen={isModalOpen}
                handleCancel={handleCancel} width={null}
                child={<ContestForm contest={null} handleSubmit={handleCreateContest} />}
            />
            <CustomModal key='update-contest'
                title={`Update contest`}
                isModalOpen={isUpdateModalOpen}
                handleCancel={handleUpdateModalCancel} width={null}
                child={<ContestForm contest={selectedContest} handleSubmit={handleUpdateContest} />}
            />
            <CustomModal key='contest-detail'
                title={selectedContest?.contestName || 'Contest Details'}
                isModalOpen={isDetailModalOpen}
                handleCancel={handleDetailModalCancel} width={1300}
                child={<ContestDetailComponent contest={selectedContest} />}
            />
        </div>
    );
}
export default ListComponent;