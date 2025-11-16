import { Image, message, Skeleton, Switch } from "antd";
import { Button, Dropdown, Input, Select, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
import {
    AuditOutlined,
    DeleteOutlined,
    EditOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import CustomModal from "../../../common/components/custom-modal";
import styled from "styled-components";
import { getError } from "../../../utils";
import { BannerEvent } from "../../../apis/banners.api";
import {
    useBannerEventToggle,
    useCreateBannerEvent,
    useDeleteBannerEvent,
    useInfoBannerEvents,
    useUpdateBannerEvent,
} from "../../../hook/useInfoBannerEvent";
import BannerEventForm from "../../../common/components/banner-event-form";
import { useDebounce } from "use-debounce";

const StyledTableContest = styled.div`
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
const { Option } = Select;
const ListComponent = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(5);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedBanner, setSelectedBanner] = useState<BannerEvent | null>(
        null
    );
    const { mutate: mutateCreate, isPending } = useCreateBannerEvent();
    const { mutate: mutateUpdate, isPending: isUpdatePending } = useUpdateBannerEvent();
    const { mutate: mutateDelete } = useDeleteBannerEvent();
    const [loadAgain, setLoadAgain] = useState(false);

    const [bannersSearch, setBannersSearch] = useState<string>("");
    const [activation, setActivation] = useState<"All" | "Active" | "Inactive">("All");
    const [debouncedSearch] = useDebounce(bannersSearch, 300);
    const [debouncedActivation] = useDebounce(activation, 300);

    const { mutate: mutateToggle } = useBannerEventToggle();

    const { data: bannerData, isLoading: loading } = useInfoBannerEvents({
        title: debouncedSearch.length ? debouncedSearch : undefined,
        active:
            debouncedActivation !== 'All'
                ? debouncedActivation === 'Active'
                    ? 'true'
                    : 'false'
                : undefined,
        page: currentPage,
        pageSize
    })

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const showUpdateModal = (record: BannerEvent) => {
        setIsUpdateModalOpen(true);
        setSelectedBanner(record);
    };

    const handleUpdateModalCancel = () => {
        setIsUpdateModalOpen(false);
        setSelectedBanner(null);
    };

    const showDetailModal = (record: BannerEvent) => {
        // TODO: Implement detail modal functionality
        console.log('Show detail for banner:', record);
        setSelectedBanner(record);
    };

    const handleCreateBanner = (formData: FormData, onSuccess: () => void) => {
        mutateCreate(formData, {
            onSuccess: () => {
                message.success("Banner created successfully!");
                setIsModalOpen(false);
                setSelectedBanner(null);
                setLoadAgain(!loadAgain);
                onSuccess();
            },
            onError: (err) => {
                message.error("Failed to create banner: " + getError(err));
            },
        });
    };

    const handleUpdateBanner = (formData: FormData, onSuccess: () => void) => {
        if (!selectedBanner) return;
        console.log(formData);
        mutateUpdate(
            { id: selectedBanner.id, formData },
            {
                onSuccess: () => {
                    message.success("Banner updated successfully!");
                    setIsUpdateModalOpen(false);
                    setLoadAgain((prev) => !prev);
                    onSuccess();
                },
                onError: (error) => {
                    message.error("Failed to update banner: " + getError(error));
                },
            }
        );
    };

    const handleDeleteBanner = (id: number) => {
        mutateDelete(id, {
            onSuccess: () => {
                message.success("Banner Event deleted successfully!");
            },
            onError: (error) => {
                message.error("Failed to delete Banner Event: " + error.message);
            },
        });
    };
    const handleTableChange = (pagination: {
        current: number;
        pageSize: number;
    }) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
    };

    const columns: ColumnsType<BannerEvent> = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: "60%",
            render: (text, record) => (
                <Space
                    title="Click to view details"
                    style={{ cursor: "pointer" }}
                    onClick={() => showDetailModal(record)}
                >
                    <AuditOutlined />
                    {text}
                </Space>
            ),
        },
        {
            title: "Image",
            dataIndex: "imageUrl",
            key: "imageUrl",
            render: (url: string) => (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Image src={url} alt="banner" style={{ width: 100, height: 40 }} />
                </div>
            ),
        },
        {
            title: "Active",
            dataIndex: "active",
            key: "active",
            render: (active: boolean, record: BannerEvent) => {
                return (
                    <Switch
                        value={active}
                        onChange={() => {
                            mutateToggle({
                                id: record.id,
                                active: !active
                            }, {
                                onSuccess: () => {}
                            })
                        }}
                    />
                );
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => {
                return (
                    <Dropdown
                        menu={{
                            items: [
                                {
                                    key: "edit",
                                    label: "Edit",
                                    icon: <EditOutlined />,
                                    onClick: () => showUpdateModal(record),
                                },
                                {
                                    key: "delete",
                                    danger: true,
                                    label: "Delete",
                                    icon: <DeleteOutlined />,
                                    onClick: () => handleDeleteBanner(record.id),
                                },
                            ],
                        }}
                        placement="bottomLeft"
                    >
                        <Button icon={<MoreOutlined />}>More</Button>
                    </Dropdown>
                );
            },
        },
    ];

    return (
        <div
            style={{
                marginTop: "0.55rem",
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
                <h3 style={{ fontSize: 18, fontWeight: 600 }}> Banner Events</h3>
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
                    <Select
                        value={activation}
                        onChange={(value: "All" | "Active" | "Inactive") => setActivation(value)}
                        defaultValue="All"
                        style={{ width: "10rem" }}
                    >
                        <Option value="All">All</Option>
                        <Option value="Active">Active</Option>
                        <Option value="Inactive">Inactive</Option>
                    </Select>
                    <Input
                        placeholder=" Search banner"
                        style={{ width: 200 }}
                        value={bannersSearch}
                        onChange={(e) => setBannersSearch(e.target.value)}
                    />
                    <Button
                        type="default"
                        onClick={() => {
                            setBannersSearch("");
                            setActivation("All");
                            setCurrentPage(1);
                        }}
                    >
                        Reset Filter
                    </Button>
                    <Button
                        type="default"
                        style={{
                            backgroundColor: "rgb(252, 125, 52)",
                            borderRadius: "rgb(252, 125, 52)",
                            color: "white",
                        }}
                        onClick={showModal}
                    >
                        Create Banner
                    </Button>
                </Space>

                <div>
                    <span>
                        Total: {bannerData?.total} and showing {pageSize}{" "}
                        / page{" "}
                    </span>
                </div>
            </Space>
            <StyledTableContest>
                {loadAgain && loading ? (
                    <Skeleton active />
                ) : (
                    <Table
                        rowKey={(record) => record.id!.toString()}
                        columns={columns}
                        dataSource={bannerData?.items}
                        bordered
                        size="small"
                        className="custom-table"
                        loading={loading}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: bannerData?.total,
                            onChange: (page, pageSize) =>
                                handleTableChange({ current: page, pageSize }),
                            showSizeChanger: true,
                            pageSizeOptions: ["5", "10", "15", "20"],
                            showTotal: (total: number) => `Total ${total} items`,
                        }}
                    />
                )}
            </StyledTableContest>
            <CustomModal
                title={selectedBanner ? "Update Banner" : "Create Banner"}
                isModalOpen={isModalOpen}
                handleCancel={handleCancel}
                child={
                    <BannerEventForm
                        banner={selectedBanner}
                        isLoading={isPending}
                        handleSubmit={
                            selectedBanner ? handleCreateBanner : handleCreateBanner
                        }
                    />
                }
            />
            <CustomModal
                key="update-contest"
                title={`Update Banner Event`}
                isModalOpen={isUpdateModalOpen}
                handleCancel={handleUpdateModalCancel}
                width={null}
                child={
                    <BannerEventForm
                        banner={selectedBanner}
                        isLoading={isUpdatePending}
                        handleSubmit={handleUpdateBanner}
                    />
                }
            />
        </div>
    );
};
export default ListComponent;
