import {
    Table,
    Tag,
    Typography,
    Button,
    Space,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import DashboardLayout from "../../core/layout/Dashboard";

const { Title } = Typography;

const BookingManagement = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const token = localStorage.getItem("accessToken");
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // decode JWT
    const role = decodedToken.role; // ADMIN, OWNER, USER
    const getUrlByRole = (role) => {
        switch (role) {
            case "ADMIN":
                return "admin/hotels";
            case "OWNER":
                return "owner/hotel-list";
            default:
                return "user/hotels"; // USER or guest
        }
    };
    useEffect(() => {
        fetchBookings();
    }, [bookings?.hotelId]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/bookings-management`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to fetch bookings");
            const data = await res.json();
            let bookingList = await data?.content || [];

            console.log("Bookings: ", bookingList);

            const updateBookings = await Promise.all(
                bookingList.map(async (booking) => {
                    if (!booking.bookingId) return { ...booking, hotel: null };

                    const hotelRes = await fetch(`http://localhost:8080/api/dashboard/admin/hotels/${booking?.hotelId}`,
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            },
                        }
                    );
                    const hotelData = await hotelRes.json();

                    const roomRes = await fetch(`http://localhost:8080/api/dashboard/admin/hotels/${booking?.hotelId}/rooms/${booking?.roomId}`,
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            },
                        }
                    );
                    const roomData = await roomRes.json();

                    return { ...booking, hotel: hotelData, room: roomData };

                })
            );
            console.log("booking response: ", updateBookings);

            setBookings(updateBookings);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };



    const handleViewDetail = (bookingId) => {
        history.push(`/dashboard/booking-detail/${bookingId}`);
    };

    const columns = [
        {
            title: "Booking ID",
            dataIndex: "bookingId",
            key: "bookingId",
            render: (id) => <Tag color="blue">{id}</Tag>,
            fixed: "left",
        },
        {
            title: "Khách hàng",
            dataIndex: "guestFullName",
            key: "guestFullName",
        },
        {
            title: "Điện thoại",
            dataIndex: "guestPhone",
            key: "guestPhone",
        },
        {
            title: "Email",
            dataIndex: "guestEmail",
            key: "guestEmail",
        },
        {
            title: "CCCD",
            dataIndex: "guestCccd",
            key: "guestCccd",
        },
        {
            title: "Hotel ID",
            dataIndex: "hotel",
            key: "hotelId",
            render: (id) => <span>{id?.hotelName}</span>,
        },
        {
            title: "Room ID",
            dataIndex: "room",
            key: "roomId",
            render: (id) => <span >{id.roomName}</span>,
        },
        {
            title: "Check-in",
            dataIndex: "checkinDate",
            key: "checkinDate",
        },
        {
            title: "Check-out",
            dataIndex: "checkoutDate",
            key: "checkoutDate",
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => `${price.toLocaleString()} VNĐ`,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag
                    color={
                        status === "CONFIRMED"
                            ? "green"
                            : status === "PAID"
                                ? "green"
                                : status === "CANCELLED"
                                    ? "volcano"
                                    : status === "COMPLETED"
                                        ? "blue"
                                        : "orange"
                    }
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(record.bookingId)}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <div style={{ padding: "16px", background: "#fff", minHeight: "100vh" }}>
                <Title level={3} style={{ marginBottom: 20 }}>
                    Quản lý Booking
                </Title>

                <Table
                    rowKey="bookingId"
                    loading={loading}
                    columns={columns}
                    dataSource={bookings}
                    pagination={false}

                />
            </div>
        </DashboardLayout>
    );
};

export default BookingManagement;
