import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
    EditOutlined,
    ArrowLeftOutlined,
    PhoneOutlined,
    UserOutlined,
    MailOutlined,
    CalendarOutlined,
    TeamOutlined,
    ApartmentOutlined,
} from "@ant-design/icons";
import { Card, Descriptions, Avatar, Table, Tag, Button, Divider, Space, Tooltip } from 'antd';
import DashboardLayout from '../../core/layout/Dashboard';
import moment from "moment";

// Fix ResizeObserver error
const resizeObserverErrorHandler = () => {
    window.addEventListener('error', (event) => {
        if (event.message.includes('ResizeObserver loop')) {
            event.stopImmediatePropagation();
        }
    });
};

if (typeof window !== 'undefined') {
    resizeObserverErrorHandler();
}

const UserDetailAdmin = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("accessToken");
    const history = useHistory();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/dashboard/admin/users/${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch user");
                const userData = await res.json();
                setUser(userData);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    if (loading) return <div style={{ padding: 20 }}>Đang tải...</div>;
    if (!user) return <div style={{ padding: 20 }}>Không tìm thấy người dùng</div>;

    const bookingColumns = [
        { title: "Mã Booking", dataIndex: "bookingId", key: "bookingId" },
        { title: "Khách sạn", dataIndex: "hotelName", key: "hotelName" },
        {
            title: "Ngày nhận",
            dataIndex: "checkInDate",
            render: d => moment(d).format("DD/MM/YYYY")
        },
        {
            title: "Ngày trả",
            dataIndex: "checkOutDate",
            render: d => moment(d).format("DD/MM/YYYY")
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: s => (
                <Tag color={s === "PAID" ? "green" : s === "PENDING" ? "orange" : "red"}>
                    {s}
                </Tag>
            )
        },
    ];

    const reviewColumns = [
        { title: "Mã Review", dataIndex: "reviewId", key: "reviewId" },
        { title: "Khách sạn", dataIndex: "hotelName", key: "hotelName" },
        { title: "Rating", dataIndex: "rating", key: "rating" },
        { title: "Nội dung", dataIndex: "comment", key: "comment" },
        { title: "Ngày tạo", dataIndex: "createdAt", render: d => moment(d).format("DD/MM/YYYY") },
    ];

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
                        <Button
                            icon={<ArrowLeftOutlined />}
                            type="text"
                            size="large"
                            onClick={() => history.goBack()}
                            style={{ marginBottom: 16 }}
                        >
                            Quay lại
                        </Button>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                                <Avatar
                                    size={100}
                                    src={user.urlImg}
                                    icon={<UserOutlined />}
                                    style={{ backgroundColor: "#1890ff" }}
                                />
                                <div>
                                    <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: "#000" }}>
                                        {user.fullname}
                                    </h1>
                                    <p style={{ margin: "8px 0 0 0", fontSize: 14, color: "#666" }}>
                                        {user.username}
                                    </p>
                                </div>
                            </div>
                     
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px 24px" }}>
                    {/* Quick Info Cards */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "16px",
                            marginBottom: "24px",
                        }}
                    >
                        {/* Phone Card */}
                        <Card style={{ textAlign: "center" }} hoverable>
                            <PhoneOutlined
                                style={{ fontSize: 28, color: "#1890ff", marginBottom: 12, display: "block" }}
                            />
                            <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>Số điện thoại</p>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#000" }}>
                                {user.phone}
                            </p>
                        </Card>

                        {/* Email Card */}
                        <Card style={{ textAlign: "center" }} hoverable>
                            <MailOutlined
                                style={{ fontSize: 28, color: "#52c41a", marginBottom: 12, display: "block" }}
                            />
                            <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>Email</p>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#000" }}>
                                {user.username}
                            </p>
                        </Card>

                        {/* Birthday Card */}
                        <Card style={{ textAlign: "center" }} hoverable>
                            <CalendarOutlined
                                style={{ fontSize: 28, color: "#faad14", marginBottom: 12, display: "block" }}
                            />
                            <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>Ngày sinh</p>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#000" }}>
                                {moment(user.birthday).format("DD/MM/YYYY")}
                            </p>
                        </Card>

                        {/* Role Card */}
                        <Card style={{ textAlign: "center" }} hoverable>
                            <TeamOutlined
                                style={{ fontSize: 28, color: "#eb2f96", marginBottom: 12, display: "block" }}
                            />
                            <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>Vai trò</p>
                            <Tag
                                color={
                                    user.roleName === "ADMIN" ? "red" :
                                        user.roleName === "OWNER" ? "gold" : "blue"
                                }
                                style={{ fontSize: 12, padding: "4px 12px" }}
                            >
                                {user.roleName}
                            </Tag>
                        </Card>
                    </div>

                    {/* Detailed Information */}
                    <Card
                        title={<span style={{ fontSize: 16, fontWeight: 600 }}>Thông tin chi tiết</span>}
                        style={{ marginBottom: 24 }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                gap: "32px",
                            }}
                        >
                            <div>
                                <div style={{ marginBottom: 24 }}>
                                    <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>
                                        Họ và tên
                                    </p>
                                    <p style={{ margin: 0, fontWeight: 600, color: "#000", fontSize: 14 }}>
                                        {user.fullname}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>
                                        Giới tính
                                    </p>
                                    <p style={{ margin: 0, fontWeight: 600, color: "#000", fontSize: 14 }}>
                                        {user.gender ? "Nam" : "Nữ"}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <div style={{ marginBottom: 24 }}>
                                    <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>
                                        Email (Gmail)
                                    </p>
                                    <p style={{ margin: 0, fontWeight: 600, color: "#000", fontSize: 14 }}>
                                        <MailOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                                        {user.username}
                                    </p>
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>
                                        Số điện thoại
                                    </p>
                                    <p style={{ margin: 0, fontWeight: 600, color: "#000", fontSize: 14 }}>
                                        <PhoneOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                                        {user.phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Owner Information - Conditional Rendering */}
                    {user.roleName === "OWNER" && (
                        <Card
                            title={<span style={{ fontSize: 16, fontWeight: 600 }}>Thông tin Owner</span>}
                            style={{ marginBottom: 24 }}
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                    gap: "32px",
                                }}
                            >
                                <div>
                                    <div style={{ marginBottom: 24 }}>
                                        <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>
                                            Trạng thái xét duyệt Owner
                                        </p>
                                        <Tag
                                            color={user.ownerRequestStatus === "APPROVED" ? "green" : "orange"}
                                            style={{ fontSize: 12, padding: "4px 12px" }}
                                        >
                                            {user.ownerRequestStatus}
                                        </Tag>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>
                                            Giấy phép kinh doanh
                                        </p>
                                        <p style={{ margin: 0, fontWeight: 600, color: "#000", fontSize: 14 }}>
                                            {user.businessLicenseNumber || "Không có"}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ marginBottom: 24 }}>
                                        <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>
                                            Kinh nghiệm (năm)
                                        </p>
                                        <p style={{ margin: 0, fontWeight: 600, color: "#000", fontSize: 14 }}>
                                            {user.experienceInHospitality || "Không có"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {user.ownerDescription && (
                                <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid #f0f0f0" }}>
                                    <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>
                                        Mô tả về chủ sở hữu
                                    </p>
                                    <p style={{ margin: 0, fontWeight: 500, color: "#000", fontSize: 14, lineHeight: 1.6 }}>
                                        {user.ownerDescription}
                                    </p>
                                </div>
                            )}
                        </Card>
                    )}

                    {/* Booking List */}
                    <Card
                        title={<span style={{ fontSize: 16, fontWeight: 600 }}>Danh sách Booking của user</span>}
                        style={{ marginBottom: 24 }}
                    >
                        <Table
                            columns={bookingColumns}
                            dataSource={user.bookings || []}
                            rowKey="bookingId"
                            pagination={{ pageSize: 10 }}
                            locale={{ emptyText: "Không có booking nào" }}
                        />
                    </Card>

                    {/* Review List */}
                    <Card
                        title={<span style={{ fontSize: 16, fontWeight: 600 }}>Danh sách Reviews của user</span>}
                    >
                        <Table
                            columns={reviewColumns}
                            dataSource={user.reviews || []}
                            rowKey="reviewId"
                            pagination={{ pageSize: 10 }}
                            locale={{ emptyText: "Không có review nào" }}
                        />
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDetailAdmin;