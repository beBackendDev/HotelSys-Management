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
import { Card, Descriptions, Avatar, Table, Tag, Button, Divider } from "antd";
import DashboardLayout from "../../core/layout/Dashboard";
import moment from "moment";

const BookingDetailAdmin = () => {
    const { bookingId } = useParams();
    const history = useHistory();
    const token = localStorage.getItem("accessToken");
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/dashboard/admin/hotels/booking/${bookingId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch booking");
                const data = await res.json();
                setBooking(data);
            } catch (error) {
                console.error("Fetch booking error:", error);
            }
        };
        fetchBooking();
    }, [bookingId]);

    if (!booking) return <div>Đang tải...</div>;

    const statusColor = {
        PAID: "green",
        PENDING: "orange",
        CANCELLED: "red",
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <Button icon={<ArrowLeftOutlined />} onClick={() => history.goBack()} style={{ marginBottom: 20 }}>
                    Quay lại
                </Button>

                {/* Booking Info */}
                <Card>
                    <Descriptions
                        title={`Booking #${booking.bookingId}`}
                        bordered
                        column={2}
                        extra={<Button icon={<EditOutlined />}>Chỉnh sửa</Button>}
                    >
                        <Descriptions.Item label="Hotel ID">{booking.hotelId}</Descriptions.Item>
                        <Descriptions.Item label="Room ID">{booking.roomId}</Descriptions.Item>

                        <Descriptions.Item label="Check-in Date">
                            <CalendarOutlined /> {moment(booking.checkinDate).format("DD/MM/YYYY")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Check-out Date">
                            <CalendarOutlined /> {moment(booking.checkoutDate).format("DD/MM/YYYY")}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tổng tiền">
                            <DollarOutlined /> {booking.totalPrice} VND
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={statusColor[booking.status]}>{booking.status}</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Divider />

                {/* Guest Info */}
                <Card title="Thông tin khách ở">
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="Họ tên">
                            <UserOutlined /> {booking.guestFullName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            <PhoneOutlined /> {booking.guestPhone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            <MailOutlined /> {booking.guestEmail}
                        </Descriptions.Item>
                        <Descriptions.Item label="CCCD">
                            <TeamOutlined /> {booking.guestCccd}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default BookingDetailAdmin;
