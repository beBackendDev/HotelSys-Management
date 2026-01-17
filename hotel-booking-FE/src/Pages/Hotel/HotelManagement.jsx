import { useEffect, useState, useMemo } from "react";
import { Popconfirm, message } from "antd";
import { Modal } from "antd";
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
    DeleteOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../../core/layout/Dashboard";
import { formatMoney, humanDate } from "../../utils/helper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { path } from "../../constant/path";
import api from "../../api/api";
//styles
const tableStyles = {
    header: {
        background: "#f0f7ff",
        fontWeight: 600,
        fontSize: 13,
        color: "#1f2937",
        textTransform: "uppercase",
        borderBottom: "1px solid #e5e7eb",
    },

    cell: {
        fontSize: 14,
        color: "#374151",
    },

    hotelName: {
        fontWeight: 600,
        color: "#2563eb",
    },

    ownerName: {
        fontWeight: 500,
        color: "#111827",
    },

    ownerEmail: {
        fontSize: 12,
        color: "#6b7280",
    },

    rating: {
        fontWeight: 500,
        color: "#111827",
    },

    actions: {
        display: "flex",
        gap: 6,
    },

    actionBtn: {
        borderRadius: 8,
    },
};
//

const withHeaderStyle = () => ({
    style: tableStyles.header,
});

const { Option } = Select;

const HotelManagement = () => {
    const token = localStorage?.getItem("accessToken");
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const role = decodedToken.role;

    const [filters, setFilters] = useState({
        status: "",
        owner_id: undefined,
        sort_by: "created_at",
        order: "desc",
        q: "",
        name: "",
        minPrice: "",
        maxPrice: "",
        facility: "",
        rating: "",
        location: "",
        page: 1,        // Frontend dùng page bắt đầu từ 1
        per_page: 5,
    });

    const hasAdvancedFilter = () => {
        return (
            filters.location ||
            filters.minPrice ||
            filters.maxPrice ||
            filters.status ||
            filters.rating 
        );
    };

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [total, setTotal] = useState(0);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getUrlByRole = (role) => {
        switch (role) {
            case "ADMIN":
                return "admin/hotels";
            case "OWNER":
                return "owner/hotels";
            default:
                return "user/hotels";
        }
    };

    // Tính STT dựa trên page hiện tại và per_page
    const hotelsWithStt = useMemo(() => {
        return hotels.map((hotel, index) => ({
            ...hotel,
            __stt: (filters.page - 1) * filters.per_page + index + 1,
        }));
    }, [hotels, filters.page, filters.per_page]);
//Modal confirm deactive
const confirmDisable = (hotelId) => {
    Modal.confirm({
        title: "Xác nhận vô hiệu hóa khách sạn",
        content: "Bạn có chắc chắn muốn vô hiệu hóa khách sạn này?",
        okText: "Xác nhận",
        cancelText: "Hủy",
        okButtonProps: { danger: true },
        onOk: () => handleDeleteHotel(hotelId),
    });
};
    // Fetch hotels
    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true);
            setError(null);
            try {
                let url = "";
                // Frontend gửi page bắt đầu từ 1, nhưng backend mong pageNo bắt đầu từ 0
                // nên ta trừ 1 trước khi gửi
                let params = new URLSearchParams({
                    pageNo: filters.page,      // Chuyển từ 1-based sang 0-based
                    pageSize: filters.per_page,
                    q: filters.q || "",
                    hotelStatus: filters.status ,
                    sort: `${filters.sort_by},${filters.order}`,
                });

                if (!hasAdvancedFilter()) {
                    params.set("q", filters.q || "");
                    params.set(
                        "status",
                        filters.status !== "all" ? filters.status : ""
                    );
                    url = `http://localhost:8080/api/dashboard/${getUrlByRole(role)}`;
                } else {
                    if (filters.name) params.set("hotelName", filters.name);
                    if (filters.location) params.set("hotelAddress", filters.location);
                    if (filters.status) params.set("hotelStatus", filters.status);
                    if (filters.minPrice) params.set("minPrice", filters.minPrice);
                    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
                    if (filters.rating) params.set("ratingPoint", filters.rating);

                    url = `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/filter`;
                }

                const res = await fetch(`${url}?${params}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });
                const data = await res.json();
                console.log("hotel: ", data?.content);

                console.log("📊 Response data:", {
                    content: data?.content?.length,
                    totalElements: data?.totalElements,
                    totalPages: data?.totalPage,
                    pageNo: data?.pageNo,
                    pageSize: data?.pageSize,
                });
                setHotels(data?.content || []);
                setTotal(data?.totalElements || 0);

            } catch (err) {
                console.error(err);
                setError("Tải danh sách khách sạn thất bại.");
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [filters, token, role]);

    const history = useHistory();

    const handleViewDetail = (hotelId) => {
        history.push(path.hotelDetailAdminPath(hotelId));
    };

    const handleChangeHotel = (hotelId) => {
        history.push(path.hotelProfileAdmin(hotelId));
    };

  const handleCreateHotel = () => {
    history.push(path.createHotel);
};


    const handleDeleteHotel = async (hotelId) => {
        try {
            const res = await fetch(
                `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/${hotelId}/delete-room`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Delete failed");
            }

            message.success("Đã vô hiệu hóa khách sạn");
            // Reload danh sách bằng cách gọi lại fetchHotels
            setFilters((f) => ({ ...f }));

        } catch (err) {
            console.error(err);
            message.error(err.message || "Vô hiệu hóa khách sạn thất bại");
        }
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "__stt",
            key: "__stt",
            width: 80,
            align: "center",
            onHeaderCell: withHeaderStyle,
            render: (v) => <span style={{ color: "#000000" }}>{v}</span>,
            sorter: (a, b) => a.__stt - b.__stt,
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Tên khách sạn",
            dataIndex: "hotelName",
            key: "hotelName",
            onHeaderCell: withHeaderStyle,
            render: (v, row) => (
                <Typography.Link
                    style={tableStyles.hotelName}
                    onClick={() => handleChangeHotel(row.hotelId)}>
                    {v}
                </Typography.Link>
            ),
            sorter: true,
        },
        {
            title: "Chủ sở hữu",
            key: "owner",
            onHeaderCell: withHeaderStyle,
            render: (_, record) => {
                const owner = record.owner;
                return owner ? (
                    <div>
                        <div style={tableStyles.ownerName}>{owner.fullname}</div>
                        <div style={tableStyles.ownerEmail}>{owner.username}</div>
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
            align: "center",
            onHeaderCell: withHeaderStyle,
            render: (s) => {
                const colorMap = {
                    ACTIVE: "green",
                    INACTIVE: "default",
                    PENDING: "gold",
                    BANNED: "red",
                };
                const title = {
                    ACTIVE: "Hoạt động",
                    INACTIVE: "Bảo trì",
                    PENDING: "Phòng kín",
                    BANNED: "Đã thu hồi",
                };
                return (
                    <Tag color={colorMap[s] || "default"}>
                        {(title[s] || "").toUpperCase()}
                    </Tag>
                );
            },
        },
        {
            title: "Đánh giá",
            dataIndex: "ratingPoint",
            key: "ratingPoint",
            align: "center",
            onHeaderCell: withHeaderStyle,
            render: (r) => (
                <span style={tableStyles.rating}>
                    {r != null ? r.toFixed(1) : "-"} ⭐
                </span>
            ),
        },
        {
    title: "Hành động",
    key: "actions",
    align: "center",
    onHeaderCell: withHeaderStyle,
    render: (_, row) => (
        <Space size={6}>
            <Tooltip title="Xem chi tiết">
                <Button
                    type="text"
                    style={tableStyles.actionBtn}
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(row.hotelId)}
                />
            </Tooltip>

            <Tooltip title="Chỉnh sửa">
                <Button
                    type="text"
                    style={tableStyles.actionBtn}
                    icon={<EditOutlined />}
                    onClick={() => handleChangeHotel(row.hotelId)}
                />
            </Tooltip>

            <Tooltip title="Vô hiệu hóa">
                {/* <Popconfirm
                    title="Xác nhận vô hiệu hóa khách sạn"
                    onConfirm={() => handleDeleteHotel(row.hotelId)}
                >
                    <Button
                        type="text"
                        style={tableStyles.actionBtn}
                        icon={<DeleteOutlined />}
                    />
                </Popconfirm> */}
                 <Button
                        type="text"
                        style={tableStyles.actionBtn}
                        icon={<DeleteOutlined />}
                        onClick={() => confirmDisable(row.hotelId)}
                    />
            </Tooltip>

            <Dropdown
                overlay={
                    <Menu>
                        <Menu.Item key="rooms">Quản lý phòng</Menu.Item>
                        <Menu.Item key="stats">Thống kê</Menu.Item>
                    </Menu>
                }
            >
                <Button
                    type="text"
                    style={tableStyles.actionBtn}
                    icon={<MoreOutlined />}
                />
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
            <div className="p-6">
                {/* ===== Header / Filters ===== */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        {/* Left: Filters */}
                        <div className="flex flex-wrap items-center gap-3">
                            <Input
                                placeholder="Tìm theo tên hoặc vị trí"
                                prefix={<SearchOutlined />}
                                className="w-[260px]"
                                value={filters.location}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, location: e.target.value, page: 1 }))
                                }
                            />

                            <Select
                                value={filters.status}
                                onChange={(v) =>
                                    setFilters((f) => ({ ...f, status: v, page: 1 }))
                                }
                                className="w-[160px]"
                            >
                                <Option value="">Tất cả trạng thái</Option>
                                <Option value="ACTIVE">Hoạt động</Option>
                                <Option value="INACTIVE">Không hoạt động</Option>
                            </Select>

                            <Select
                                placeholder="Chủ sở hữu"
                                allowClear
                                className="w-[200px]"
                                value={filters.owner_id}
                                onChange={(v) =>
                                    setFilters((f) => ({ ...f, owner_id: v, page: 1 }))
                                }
                            />
                        </div>

                        {/* Right: Primary Action */}
                        <div className="flex justify-end">
                            <Button
                                type="primary"
                                size="large"
                                onClick={handleCreateHotel}
                            >
                                + Tạo khách sạn mới
                            </Button>
                        </div>
                    </div>
                </div>

                {/* ===== Batch Actions ===== */}
                {selectedRowKeys.length > 0 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Badge count={selectedRowKeys.length} />
                            <span className="text-sm text-gray-600">
                                khách sạn được chọn
                            </span>
                        </div>

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

                {/* ===== Error ===== */}
                {error && (
                    <Alert
                        type="error"
                        message={error}
                        showIcon
                        className="mb-4"
                    />
                )}

                {/* ===== Table ===== */}
                <div className="bg-white rounded-xl shadow-sm p-3">
                    <Spin spinning={loading}>
                        <Table
                            rowKey="hotelId"
                            dataSource={hotelsWithStt}
                            columns={columns}
                            rowSelection={rowSelection}
                            pagination={{
                                current: filters.page,
                                pageSize: filters.per_page,
                                total: total,
                                showSizeChanger: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total}`,
                                onChange: (page, pageSize) =>
                                    setFilters((f) => ({ ...f, page, per_page: pageSize })),
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
            </div>
        </DashboardLayout>
    );
};

export default HotelManagement;