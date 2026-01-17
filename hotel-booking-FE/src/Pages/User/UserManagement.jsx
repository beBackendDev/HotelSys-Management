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
    Form,
    Typography,
    Tooltip,
    Spin,
    Alert,
    Modal,
    List,
} from "antd";
import {
    SearchOutlined,
    CheckOutlined,
    EditOutlined,
    EyeOutlined,
    CloseOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import DashboardLayout from "../../core/layout/Dashboard";
import { formatMoney, humanDate } from "../../utils/helper";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { path } from "../../constant/path";
import api from "../../api/api";
import { toast } from "react-toastify";

const { Option } = Select;

const ReviewsColumnStatic = ({ reviews = [] }) => {
    const [visible, setVisible] = useState(false);

    return (
        <>
            <Button
                type="link"
                disabled={reviews.length === 0}
                onClick={() => setVisible(true)}
            >
                Xem đánh giá ({reviews.length})
            </Button>

            <Modal
                visible={visible}
                title="Danh sách đánh giá"
                footer={null}
                onCancel={() => setVisible(false)}
                width={700}
                getContainer={false}
            >
                <List
                    dataSource={reviews}
                    renderItem={(item) => (
                        <List.Item key={item.id}>
                            <b>{item.hotelName || "hotel name"}</b>
                            <p>{item.comment}</p>
                            <Tag>⭐ {item.ratingPoint}</Tag>
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
};

const UserManagement = () => {
    const token = localStorage?.getItem("accessToken");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // DUYỆT OWNER
    const [roleModalVisible, setRoleModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [roleForm] = Form.useForm();
    const [roleLoading, setRoleLoading] = useState(false);

    const tableStyles = {
        header: {
            background: "#f0f7ff",
            fontWeight: 600,
            fontSize: 13,
            color: "#1f2937",
            textTransform: "uppercase",
            borderBottom: "1px solid #e5e7eb",
        },
    };

    const withHeaderStyle = () => ({
        style: tableStyles.header,
    });

    const usersWithStt = useMemo(() => {
        return user.map((b, index) => ({
            ...b,
            __stt: (pagination.current - 1) * pagination.pageSize + index + 1,
        }));
    }, [user, pagination.current, pagination.pageSize]);

    // ========== API FUNCTIONS ==========
    const fetchUsers = async (page = 1, pageSize = 10) => {
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
            let usersList = data?.content || [];
            console.log("users: ", usersList);

            // Fetch thông tin review và booking cho từng user
            const updateUsers = await Promise.all(
                usersList.map(async (user) => {
                    try {
                        const reviewList = await fetch(
                            `http://localhost:8080/api/dashboard/admin/user-review/${user.userId}/reviews-list`,
                            {
                                method: "GET",
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                }
                            }
                        );
                        const reviewData = await reviewList.json();

                        const bookingList = await fetch(
                            `http://localhost:8080/api/dashboard/admin/hotels/${user.userId}/bookings-management`,
                            {
                                method: "GET",
                                headers: {
                                    "Authorization": `Bearer ${token}`,
                                }
                            }
                        );
                        const bookingData = await bookingList.json();

                        return {
                            ...user,
                            reviews: reviewData.content || [],
                            bookings: bookingData || []
                        };
                    } catch (err) {
                        console.error("Error fetching user details:", err);
                        return { ...user, reviews: [], bookings: [] };
                    }
                })
            );

            setUser(updateUsers);
            setPagination({
                ...pagination,
                total: updateUsers.length,
            });
        } catch (err) {
            console.error(err);
            setError("Tải danh sách người dùng thất bại.");
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, decision, adminNote) => {
        const res = await fetch(
            `http://localhost:8080/api/dashboard/admin/update-role/user/${userId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    decision: decision,
                    adminNote: adminNote || "",
                }),
            }
        );

        if (!res.ok) {
            throw new Error("Cập nhật role thất bại");
        }
        return res.text();
    };

    // ========== HANDLERS ==========
    const handleOpenRoleModal = (user) => {
        if (user.ownerRequestStatus !== "PENDING") {
            toast.warning("Chỉ có thể cập nhật role cho những yêu cầu đang chờ duyệt");
            return;
        }
        setSelectedUser(user);
        setRoleModalVisible(true);
        roleForm.resetFields();
    };

    const handleApproveRole = async () => {
        try {
            const values = await roleForm.validateFields();
            setRoleLoading(true);
            await updateUserRole(
                selectedUser.userId,
                "APPROVED",
                values.adminNote
            );
            toast.success("Duyệt thành công - Người dùng được nâng lên Chủ sở hữu");
            setRoleModalVisible(false);
            roleForm.resetFields();
            fetchUsers(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Duyệt thất bại");
        } finally {
            setRoleLoading(false);
        }
    };

    const handleRejectRole = async () => {
        try {
            const values = await roleForm.validateFields();
            setRoleLoading(true);
            await updateUserRole(
                selectedUser.userId,
                "REJECTED",
                values.adminNote
            );
            toast.success("Từ chối yêu cầu thành công");
            setRoleModalVisible(false);
            roleForm.resetFields();
            fetchUsers(pagination.current, pagination.pageSize);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Từ chối thất bại");
        } finally {
            setRoleLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(pagination.current, pagination.pageSize);
    }, [token]);

    const history = useHistory();

    const handleViewDetail = (userId) => {
        history.push(path.userDetailAdminPath(userId));
    };

    const handleChangeUser = (userId) => {
        history.push(path.userUpdateAdmin(userId));
    };

    const handleTableChange = (newPagination, _filters, sorter) => {
        setPagination({
            ...pagination,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "__stt",
            key: "__stt",
            onHeaderCell: withHeaderStyle,
            width: 70,
            sorter: (a, b) => a.__stt - b.__stt,
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Tên người dùng",
            onHeaderCell: withHeaderStyle,
            key: "userName",
            render: (_, record) => (
                <div>
                    <div style={{ fontWeight: 600 }}>{record.fullname}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                        {record.username}
                    </div>
                </div>
            ),
        },
        {
            title: "Giới tính",
            dataIndex: "gender",
            onHeaderCell: withHeaderStyle,
            key: "gender",
            render: (gender) => {
                const genderMapper = {
                    true: "Nam",
                    false: "Nữ",
                };
                const tagColor = {
                    true: "green",
                    false: "orange",
                };
                return (
                    <Tag color={tagColor[gender] || "default"}>
                        {genderMapper[gender] || ""}
                    </Tag>
                );
            },
        },
        {
            title: "Tổng booking",
            onHeaderCell: withHeaderStyle,
            dataIndex: "bookings",
            key: "total_bookings",
            align: "center",
            render: (bookings) => (
                <span>{bookings?.totalElements || 0}</span>
            ),
        },
        {
            title: "Danh sách đánh giá",
            dataIndex: "reviews",
            onHeaderCell: withHeaderStyle,
            key: "reviews",
            render: (reviews) => <ReviewsColumnStatic reviews={reviews || []} />,
            align: "center",
        },
        {
            title: "Tình trạng thành viên",
            dataIndex: "ownerRequestStatus",
            onHeaderCell: withHeaderStyle,
            key: "ownerRequestStatus",
            render: (status, record) => {
                const tagColor = {
                    NONE: "gray",
                    PENDING: "orange",
                    APPROVED: "green",
                    REJECTED: "red",
                };
                const ownerStatus = {
                    NONE: "Người dùng",
                    PENDING: "Đợi duyệt",
                    APPROVED: "Chủ sở hữu",
                    REJECTED: "Từ chối",
                };

                const isPending = status === "PENDING";

                return (
                    <Tag
                        color={tagColor[status] || "default"}
                        style={{
                            cursor: isPending ? "pointer" : "default",
                        }}
                        onClick={() => isPending && handleOpenRoleModal(record)}
                    >
                        {ownerStatus[status] || ""}
                        {isPending && <span style={{ marginLeft: 8 }}>⚙️ Duyệt</span>}
                    </Tag>
                );
            },
            align: "center",
        },
        {
            title: "Hành động",
            onHeaderCell: withHeaderStyle,
            key: "actions",
            width: 120,
            render: (_, row) => (
                <Space size="small">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(row?.userId)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleChangeUser(row?.userId)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button type="text" size="small" icon={<DeleteOutlined />} />
                    </Tooltip>
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
            <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
                {/* Header Section */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "24px",
                        marginBottom: "24px",
                        borderBottom: "1px solid #f0f0f0",
                    }}
                >
                    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: "#000" }}>
                            Quản lý người dùng
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: 14, color: "#666" }}>
                            Quản lý tài khoản người dùng và phê duyệt yêu cầu chủ sở hữu
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px 24px" }}>
                    {selectedRowKeys.length > 0 && (
                        <div style={{ marginBottom: 20, padding: "12px 16px", backgroundColor: "#f0f7ff", borderRadius: "4px", border: "1px solid #b3d8ff" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Badge count={selectedRowKeys.length} />
                                    <span style={{ fontSize: 14, color: "#1f2937" }}>
                                        Đã chọn {selectedRowKeys.length} người dùng
                                    </span>
                                </div>
                                <Space>
                                    <Button size="small">Kích hoạt</Button>
                                    <Button size="small">Vô hiệu hóa</Button>
                                    <Button size="small" danger>
                                        Lưu trữ
                                    </Button>
                                </Space>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div style={{ marginBottom: 20 }}>
                            <Alert type="error" message={error} showIcon />
                        </div>
                    )}

                    <Spin spinning={loading}>
                        <Table
                            rowKey="userId"
                            dataSource={usersWithStt}
                            columns={columns}
                            rowSelection={rowSelection}
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total,
                                showSizeChanger: true,
                                pageSizeOptions: ["10", "20", "50"],
                                showTotal: (total) => `Tổng cộng ${total} người dùng`,
                            }}
                            onChange={handleTableChange}
                            style={{ backgroundColor: "#fff", borderRadius: "4px" }}
                        />
                    </Spin>
                </div>
            </div>

            {/* Role Update Modal */}
            <Modal
                title="Cập nhật quyền hạn Chủ sở hữu"
                visible={roleModalVisible}
                onCancel={() => setRoleModalVisible(false)}
                footer={null}
                width={600}
            >
                {selectedUser && (
                    <div>
                        <div
                            style={{
                                marginBottom: 20,
                                padding: "12px 16px",
                                backgroundColor: "#f5f5f5",
                                borderRadius: "4px",
                            }}
                        >
                            <p style={{ margin: 0, fontSize: 14 }}>
                                <strong>Người dùng:</strong> {selectedUser.fullname}
                            </p>
                            <p style={{ margin: "8px 0 0 0", fontSize: 14 }}>
                                <strong>Email:</strong> {selectedUser.username}
                            </p>
                        </div>

                        <Form
                            form={roleForm}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Ghi chú từ Admin"
                                name="adminNote"
                                rules={[
                                    {
                                        required: true,
                                        message: "Vui lòng nhập ghi chú quyết định",
                                    },
                                ]}
                            >
                                <Input.TextArea
                                    placeholder="Nhập lý do duyệt hoặc từ chối..."
                                    rows={4}
                                />
                            </Form.Item>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 12,
                                    justifyContent: "flex-end",
                                    marginTop: 24,
                                }}
                            >
                                <Button onClick={() => setRoleModalVisible(false)}>
                                    Hủy
                                </Button>
                                <Button
                                    danger
                                    icon={<CloseOutlined />}
                                    loading={roleLoading}
                                    onClick={handleRejectRole}
                                >
                                    Từ chối
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    loading={roleLoading}
                                    onClick={handleApproveRole}
                                >
                                    Duyệt
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
            </Modal>
        </DashboardLayout>
    );
};

export default UserManagement;