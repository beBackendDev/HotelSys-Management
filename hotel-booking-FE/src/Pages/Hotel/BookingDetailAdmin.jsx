import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
    ArrowLeftOutlined,
    EditOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    CalendarOutlined,
    TeamOutlined,
    DollarOutlined,
    HomeOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, Button, Divider, Tag, Spin, Alert, Typography } from "antd";
import DashboardLayout from "../../core/layout/Dashboard";
import moment from "moment";

const { Title, Text } = Typography;

const BookingDetailAdmin = () => {
    const { bookingId } = useParams();
    const history = useHistory();
    const token = localStorage.getItem("accessToken");
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const role = decodedToken.role;
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUrlByRole = (role) => {
        switch (role) {
            case "ADMIN":
                return "admin";
            case "OWNER":
                return "owner";
            default:
                return "user";
        }
    };

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/booking/${bookingId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch booking");
                const data = await res.json();
                setBooking(data);
            } catch (error) {
                console.error("Fetch booking error:", error);
                setError("Không thể tải chi tiết booking");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId, role, token]);

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ padding: 24, textAlign: "center" }}>
                    <Spin tip="Đang tải chi tiết booking..." />
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div style={{ padding: 24 }}>
                    <Alert type="error" message="Lỗi" description={error} showIcon />
                    <Button
                        onClick={() => history.goBack()}
                        style={{ marginTop: 16 }}
                        icon={<ArrowLeftOutlined />}
                    >
                        Quay lại
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    if (!booking) {
        return (
            <DashboardLayout>
                <div style={{ padding: 24 }}>
                    <Alert type="warning" message="Không tìm thấy booking" showIcon />
                </div>
            </DashboardLayout>
        );
    }

    const statusColor = {
        PAID: "green",
        PENDING: "orange",
        CANCELLED: "red",
    };

    return (
        <DashboardLayout>
            <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => history.goBack()}
                        style={{ marginBottom: 16 }}
                    >
                        Quay lại
                    </Button>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <Title level={2} style={{ margin: 0 }}>
                                Chi tiết đơn đặt phòng
                            </Title>
                            <Text type="secondary" style={{ fontSize: 14 }}>
                                Booking #{booking.bookingId}
                            </Text>
                        </div>
                        <Button
                            type="primary"
                            size="large"
                            icon={<EditOutlined />}
                        >
                            Chỉnh sửa
                        </Button>
                    </div>
                </div>

                {/* Booking Info Card */}
                <Card style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ marginBottom: 24 }}>
                        Thông tin đặt phòng
                    </Title>
                    <Row gutter={[24, 24]}>
                        {/* Left Column */}
                        <Col xs={24} sm={12} md={6}>
                            <div style={{ marginBottom: 16 }}>
                                {/* Hotel Name */}
                                <Text strong style={{ fontSize: 18, display: "block" }}>
                                    {booking.hotelName}
                                </Text>

                                {/* Hotel ID */}
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Hotel ID: {booking.hotelId}
                                </Text>
                            </div>

                           <div style={{ marginBottom: 16 }}>
                                {/* Hotel Name */}
                                <Text strong style={{ fontSize: 18, display: "block" }}>
                                    {booking.roomName}
                                </Text>

                                {/* Hotel ID */}
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Hotel ID: {booking.roomId}
                                </Text>
                            </div>
                        </Col>

                        {/* Middle Column */}
                        <Col xs={24} sm={12} md={6}>
                            <div style={{ marginBottom: 16 }}>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                                    <CalendarOutlined /> Ngày nhận phòng
                                </Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {moment(booking.checkinDate).format("DD/MM/YYYY")}
                                </Text>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                                    <CalendarOutlined /> Ngày trả phòng
                                </Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {moment(booking.checkoutDate).format("DD/MM/YYYY")}
                                </Text>
                            </div>
                        </Col>

                        {/* Right Column */}
                        <Col xs={24} sm={12} md={6}>
                            <div style={{ marginBottom: 16 }}>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                                    <DollarOutlined /> Tổng tiền
                                </Text>
                                <Text strong style={{ fontSize: 18, color: "#52c41a" }}>
                                    {booking.totalPrice?.toLocaleString()} VND
                                </Text>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                                    Trạng thái
                                </Text>
                                <Tag color={statusColor[booking.status]} style={{ fontSize: 12, padding: "4px 8px" }}>
                                    {booking.status}
                                </Tag>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Guest Info Card */}
                <Card>
                    <Title level={4} style={{ marginBottom: 24 }}>
                        Thông tin khách ở
                    </Title>
                    <Row gutter={[24, 24]}>
                        {/* Guest Name */}
                        <Col xs={24} sm={12}>
                            <div style={{ marginBottom: 24 }}>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
                                    <UserOutlined /> Họ tên
                                </Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {booking.guestFullName}
                                </Text>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
                                    <PhoneOutlined /> Số điện thoại
                                </Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {booking.guestPhone}
                                </Text>
                            </div>
                        </Col>

                        {/* Email & ID */}
                        <Col xs={24} sm={12}>
                            <div style={{ marginBottom: 24 }}>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
                                    <MailOutlined /> Email
                                </Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {booking.guestEmail}
                                </Text>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 8 }}>
                                    <TeamOutlined /> CCCD
                                </Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {booking.guestCccd}
                                </Text>
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default BookingDetailAdmin;