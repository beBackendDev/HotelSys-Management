import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
    Table,
    Input,
    Select,
    Button,
    Space,
    Tag,
    Badge,
    Dropdown,
    Menu,
    Typography,
    Tooltip,
    Spin,
    Alert,
} from "antd";
import {
    SearchOutlined,
    MoreOutlined,
    EditOutlined,
    EyeOutlined,
    UserSwitchOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../../core/layout/Dashboard";
// import useDebounce from "../../core/hooks/useDebounce";
import { formatMoney, humanDate } from "../../utils/helper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { path } from "../../constant/path";
import api from "../../api/api";

const { Option } = Select;

const HotelManagement = () => {
    const token = localStorage?.getItem("accessToken");
    const [filters, setFilters] = useState({
        //phát triển thêm
        status: "all",
        owner_id: undefined,
        sort_by: "created_at",
        order: "desc",
        //FilterRequest
        q: "",
        name: "",
        minPrice: "",
        maxPrice: "",
        facility: "",
        rating: "",
        location: "",
        page: 1,
        per_page: 10,
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [owners, setOwners] = useState([]);
    const [total, setTotal] = useState(0);

    //   const debouncedQ = useDebounce(filters.q, 300);





    // fetch hotels whenever filters change
    // --- Trong state ---
    const [hotels, setHotels] = useState([]); // hotel đã có owner gắn sẵn
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Fetch hotels + owners cùng lúc, gắn owner vào từng hotel ---
    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true);
            setError(null);
            try {
                // fetch danh sách hotels
                const res = await api.get("/hotels", {
                    params: {
                        pageNo: filters.page,
                        pageSize: filters.per_page,
                        sortBy: filters.sort_by,
                        order: filters.order,
                    },
                });

                let hotelList = res.data.content || [];

                // fetch owner cho từng hotel
                const updatedHotels = await Promise.all(
                    hotelList.map(async (hotel) => {
                        if (!hotel.ownerId) return { ...hotel, owner: null };

                        const ownerRes = await fetch(
                            `http://localhost:8080/api/admin/users/${hotel.ownerId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );
                        const ownerData = await ownerRes.json();
                        console.log("(HotelManagement.jsx) owner: ", ownerData);
                        
                        return { ...hotel, owner: ownerData }; // gắn owner
                    })
                );

                setHotels(updatedHotels);
            } catch (err) {
                console.error(err);
                setError("Tải danh sách khách sạn thất bại.");
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [filters, token]);

    const history = useHistory();
    const handleViewDetail = (hotelId) => {
        history.push(path.hotelDetailAdminPath(hotelId))
    }
    const handleChangeHotel = (hotelId) => {
        history.push(path.hotelProfileAdmin(hotelId))

    }
    const handleCreateHotel = () => {
        history.push(path.createHotel)

    }

    const columns = [
        {
            title: "Tên khách sạn",
            dataIndex: "hotelName",
            key: "hotelName",
            render: (v, row) => (
                <Typography.Link onClick={() => handleChangeHotel(row.hotelId)}> {v} </Typography.Link>
            ),
            sorter: true,
        },
        // {
        //     title: "Vị trí",
        //     dataIndex: "hotelAddress",
        //     key: "hotelAddress",
        // },
        {
            title: "Chủ sở hữu",
            key: "owner",
            render: (_, record) => {
                const owner = record.owner;
                return owner ? (
                    <div>
                        <div>{owner.fullname}</div>
                        <div className="text-xs text-gray-500">{owner.username}</div>
                    </div>
                ) : (
                    <Tag color="orange">Chưa gán</Tag>
                );
            },
        },
        {
            title: "Trạng thái",
            dataIndex: "hotelStatus",
            key: "hotelStatus",
            render: (s) => {
                const colorMap = {
                    AVAILABLE: "green",
                    inactive: "default",
                    pending: "gold",
                    archived: "red",
                };
                return <Tag color={colorMap[s] || "default"}>{(s || "").toUpperCase()}</Tag>;
            },
        },
        {
            title: "Doanh thu (tháng)",
            dataIndex: "revenue_monthly",
            key: "revenue_monthly",
            render: (r) => `${formatMoney(r)} VND`,
            align: "right",
        },
        {
            title: "Tổng booking",
            dataIndex: "total_bookings",
            key: "total_bookings",
            align: "center",
        },
        {
            title: "Đánh giá",
            dataIndex: "ratingPoint",
            key: "ratingPoint",
            render: (r) => <span>{r != null ? r.toFixed(1) : "-"} ⭐</span>,
            align: "center",
        },
        // {
        //     title: "Ngày được nâng cấp",
        //     dataIndex: "hotelUpdatedAt",
        //     key: "hotelUpdatedAt",
        //     render: (d) => humanDate(d),
        // },
        {
            title: "Hành động",
            key: "actions",
            render: (_, row) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(row.hotelId)} />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleChangeHotel(row.hotelId)} />
                    </Tooltip>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="manage-rooms">Quản lý phòng</Menu.Item>
                                <Menu.Item key="stats">Thống kê</Menu.Item>
                                <Menu.Item key="toggle-status">
                                    {row.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };

    return (
        <DashboardLayout>
            <div className="p-6 max-w-full">
                <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
                    {/* TÌm kiếm */}

                    <div className="flex gap-3 flex-wrap">
                        <Input
                            placeholder="Tìm theo tên hoặc vị trí"
                            prefix={<SearchOutlined />}
                            style={{ width: 260 }}
                            value={filters.q}
                            onChange={(e) =>
                                setFilters((f) => ({ ...f, q: e.target.value, page: 1 }))
                            }
                        />

                        <Select
                            value={filters.status}
                            onChange={(v) =>
                                setFilters((f) => ({ ...f, status: v, page: 1 }))
                            }
                            style={{ width: 140 }}
                        >
                            <Option value="all">Tất cả trạng thái</Option>
                            <Option value="active">Còn phòng</Option>
                            <Option value="inactive">Hết phòng</Option>
                        </Select>
                        <Select
                            placeholder="Chủ sở hữu"
                            allowClear
                            style={{ width: 180 }}
                            value={filters.owner_id}
                            onChange={(v) => setFilters((f) => ({ ...f, owner_id: v, page: 1 }))}
                        >
                            {/* <Option value={undefined}>Tất cả owner</Option>
                            {owners.map((o) => (
                                <Option key={o.id} value={o.id}>
                                    {o.name}
                                </Option>
                            ))} */}
                        </Select>
                    </div>

                    <div className="flex gap-2">
                        <Button type="primary" onClick={() => handleCreateHotel()} >Tạo khách sạn mới</Button>
                    </div>
                </div>

                {selectedRowKeys.length > 0 && (
                    <div className="mb-3 flex items-center gap-4">
                        <Badge count={selectedRowKeys.length} />
                        <Space>
                            <Button size="small">Kích hoạt</Button>
                            <Button size="small">Vô hiệu hóa</Button>
                            <Button size="small">Gán owner</Button>
                            <Button size="small" danger>
                                Lưu trữ
                            </Button>
                        </Space>
                    </div>
                )}

                {error && (
                    <div className="mb-4">
                        <Alert type="error" message={error} showIcon />
                    </div>
                )}

                <Spin spinning={loading}>
                    <Table
                        rowKey="id"
                        dataSource={hotels}
                        columns={columns}
                        rowSelection={rowSelection}
                        pagination={{
                            current: filters.page,
                            pageSize: filters.per_page,
                            total,
                            showSizeChanger: true,
                            onChange: (page, per_page) =>
                                setFilters((f) => ({ ...f, page, per_page })),
                        }}
                        onChange={(pagination, _filters, sorter) => {
                            if (sorter.field) {
                                setFilters((f) => ({
                                    ...f,
                                    sort_by: sorter.field,
                                    order: sorter.order === "ascend" ? "asc" : "desc",
                                }));
                            }
                        }}
                    />
                </Spin>
            </div>
        </DashboardLayout>
    );
};

export default HotelManagement;
