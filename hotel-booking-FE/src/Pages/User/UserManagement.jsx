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
    Modal,
    List,
} from "antd";
import {
    SearchOutlined,
    MoreOutlined,
    EditOutlined,
    EyeOutlined,
    UserSwitchOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../../core/layout/Dashboard";
// import useDebounce from "../../core/hooks/useDebounce";
import { formatMoney, humanDate } from "../../utils/helper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { path } from "../../constant/path";
import api from "../../api/api";

const { Option } = Select;

const UserManagement = () => {
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
    const [total, setTotal] = useState(0);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    //   const debouncedQ = useDebounce(filters.q, 300);


    // fetch users whenever filters change
    // --- Trong state ---
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`http://localhost:8080/api/dashboard/admin/users`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });
                const data = await res.json();
                let usersList = data?.content;
                
                //fetch review cho tung user 
                const updateUsers = await Promise.all(
                    usersList.map(async (user) => {
                        if (user.review == []) return { ...user, review: [] };

                        const reviewList = await fetch(`http://localhost:8080/api/dashboard/admin/user-review/${user.userId}/reviews-list`, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            }
                        });
                        const reviewData = await reviewList.json();
                        console.log("Review List: ", reviewData);

                        const bookingList = await fetch(`http://localhost:8080/api/dashboard/admin/hotels/bookings-management`, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            }
                        });

                        const bookingData = await bookingList.json();
                        //Thuc hien update lai thong tin thong tin User
                        return { ...user, reviews: reviewData, bookings: bookingData};

                    })
                );
                setUser(updateUsers);
                console.log(updateUsers);

            } catch (err) {
                console.error(err);
                setError("Tải danh sách người dùng thất bại.");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [token]);



    const history = useHistory();
    const handleViewDetail = (userId) => {
        history.push(path.hotelDetailAdminPath(userId))
    }
    const handleChangeHotel = (userId) => {
        history.push(path.hotelProfileAdmin(userId))

    }
    const handleCreateHotel = () => {
        history.push(path.createHotel)

    }

    const columns = [

        {
            title: "Tên người dùng",
            key: "userName",
            render: (_, record) => {
                console.log("record: ", _);

                const owner = record;
                return owner ? (
                    <div>
                        <div>{owner.fullname}</div>
                        <div className="text-xs text-gray-500">{owner.username}</div>
                    </div>
                ) : (
                    <Tag color="orange">Chưa gán</Tag>
                );
            },
            sorter: "true"
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            key: "gender",
            render: (s) => {
                const genderMapper = {
                    true: "Nam",
                    false: "Nữ",

                };
                const tagColor = {
                    true: "green",
                    false: "orange",
                }
                return <Tag color={tagColor[s] || "default"}> {(genderMapper[s] || "")}</Tag>;
            },
        },

        {
            title: "Tổng booking",
            dataIndex: "bookings",
            key: "total_bookings",
            align: "center",
            render: (bookings) => {
                return <span>{bookings.totalElements}</span>;
            },

        },
        {
            title: "Danh sách đánh giá",
            dataIndex: "reviews",
            key: "reviews",
            render: (reviews) => <ReviewsColumnStatic reviews={reviews} />,

            align: "center",
        },
        {
            title: "Tình trạng thành viên",
            dataIndex: "ownerRequestStatus",
            key: "ownerRequestStatus",
            render: (r) => {
                const tagColor = {
                    NONE: "gray",
                    PENDING: "orange",
                    APPROVED: "green",
                    REJECTED: "red",
                }
                const ownerStatus = {
                    NONE: "Chưa đăng ký",
                    PENDING: "Đợi duyệt",
                    APPROVED: "Chủ sở hữu",
                    REJECTED: "Từ chối",
                }
                return <Tag color={tagColor[r] || "default"}> {(ownerStatus[r] || "")}</Tag>
            },
            align: "center",
        },
        {
            title: "Hành động",
            key: "actions",
            render: (_, row) => (
                <Space size="middle">
                    <Tooltip title="Xem chi tiết">
                        {/* <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(row.hotelId)} /> */}
                        <Button type="text" icon={<EyeOutlined />} />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        {/* <Button type="text" icon={<EditOutlined />} onClick={() => handleChangeHotel(row.hotelId)} /> */}
                        <Button type="text" icon={<EditOutlined />} />
                    </Tooltip>
                      <Tooltip title="Xóa">
                        {/* <Button type="text" icon={<EditOutlined />} onClick={() => handleChangeHotel(row.hotelId)} /> */}
                        <Button type="text" icon={<DeleteOutlined />} />
                    </Tooltip>
                </Space>
            ),
        },
    ];
    const ReviewsColumnStatic = ({ reviews }) => {
        const [visible, setVisible] = useState(false);

        return (
            <>
                <Button type="link" onClick={() => setVisible(true)}>
                    Xem đánh giá ({reviews?.length || 0})
                </Button>

                <Modal
                    open={visible}
                    title="Danh sách đánh giá"
                    footer={null}
                    onCancel={() => setVisible(false)}
                    width={700}
                >
                    <List
                        dataSource={reviews}
                        renderItem={(item) => (
                            <List.Item>
                                <b>{item.hotelName || "hotel name"}</b>
                                <p>{item.comment}</p>
                                <Tag>⭐ {item.rating}</Tag>
                            </List.Item>
                        )}
                    />
                </Modal>
            </>
        );
    };

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
                        {/* <Button type="primary" onClick={() => handleCreateHotel()} >Tạo khách sạn mới</Button> */}
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
                        dataSource={user}
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

export default UserManagement;
