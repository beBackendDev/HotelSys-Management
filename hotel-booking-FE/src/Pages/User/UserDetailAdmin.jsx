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
import { Card, Descriptions, Avatar, Table, Tag, Button, Divider } from 'antd';
import DashboardLayout from '../../core/layout/Dashboard';
import moment from "moment";

const UserDetailAdmin = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
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
            }
        };

        fetchUser();
    }, [userId]);

    if (!user) return <div>Đang tải...</div>;

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
            <div className="p-6">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => history.goBack()}
                    style={{ marginBottom: 20 }}
                >
                    Quay lại
                </Button>

                {/* Thông tin cơ bản */}
                <Card>
                    <Descriptions
                        title={
                            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                                <Avatar size={80} src={user.urlImg} icon={<UserOutlined />} />
                                <span style={{ fontSize: 22 }}>{user.fullname}</span>
                            </div>
                        }
                        bordered
                        column={2}
                        extra={<Button icon={<EditOutlined />}>Chỉnh sửa</Button>}
                    >
                        <Descriptions.Item label="Username (Gmail)">{user.username}</Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại" span={1}>
                            <PhoneOutlined /> {user.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Giới tính">
                            {user.gender ? "Nam" : "Nữ"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày sinh">
                            <CalendarOutlined /> {moment(user.birthday).format("DD/MM/YYYY")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Vai trò" span={2}>
                            <Tag color={user.roleName === "ADMIN" ? "red" : user.roleName === "OWNER" ? "gold" : "blue"}>
                                {user.roleName}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Divider />

                {/* Nếu là OWNER thì hiển thị thêm thông tin Owner */}
                {user.roleName === "OWNER" && (
                    <Card title="Thông tin Owner" style={{ marginBottom: 20 }}>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Trạng thái xét duyệt Owner">
                                <Tag color={user.ownerRequestStatus === "APPROVED" ? "green" : "orange"}>
                                    {user.ownerRequestStatus}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Giấy phép kinh doanh">
                                {user.businessLicenseNumber || "Không có"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Kinh nghiệm (năm)">
                                {user.experienceInHospitality || "Không có"}
                            </Descriptions.Item>
                            <Descriptions.Item label="Mô tả về chủ sở hữu">
                                {user.ownerDescription || "Không có"}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                )}

                {/* Danh sách Booking */}
                <Card title="Danh sách Booking của user" style={{ marginBottom: 20 }}>
                    <Table
                        columns={bookingColumns}
                        dataSource={user.bookings || []}
                        rowKey="bookingId"
                        pagination={{ pageSize: 5 }}
                    />
                </Card>

                {/* Danh sách Review */}
                <Card title="Danh sách Reviews của user">
                    <Table
                        columns={reviewColumns}
                        dataSource={user.reviews || []}
                        rowKey="reviewId"
                        pagination={{ pageSize: 5 }}
                    />
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default UserDetailAdmin;
