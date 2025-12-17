import {
    Table,
    Tag,
    Typography,
    Button,
    DatePicker,
    Space,
    Badge,
    Dropdown,
    List,
} from "antd";
import { EyeOutlined, CalendarOutlined, BellOutlined } from "@ant-design/icons";

import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import DashboardLayout from "../../core/layout/Dashboard";
import dayjs from "dayjs";

const { Title } = Typography;

const BookingManagement = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [filterMode, setFilterMode] = useState("ALL");
    // ALL | STAYING

    const [bookings, setBookings] = useState([]);
    const [mode, setMode] = useState("ALL"); // ALL | DATE
    const [selectedDate, setSelectedDate] = useState(null);


    const token = localStorage.getItem("accessToken");
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const role = decodedToken.role;

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
    const [notifications] = useState([
        {
            id: 1,
            title: "Booking mới",
            content: "Phòng Deluxe - Happiness Hotel",
        },
        {
            id: 2,
            title: "Booking mới",
            content: "Phòng Superior - Sunshine Hotel",
        },
    ]);

    const unreadCount = notifications.length;
    const notificationMenu = (
        <List
            size="small"
            dataSource={notifications}
            style={{ width: 320 }}
            locale={{ emptyText: "Không có thông báo mới" }}
            renderItem={(item) => (
                <List.Item>
                    <div>
                        <Typography.Text strong>
                            {item.title}
                        </Typography.Text>
                        <br />
                        <Typography.Text type="secondary">
                            {item.content}
                        </Typography.Text>
                    </div>
                </List.Item>
            )}
        />
    );

    useEffect(() => {
        fetchBookings();
    }, [mode, selectedDate]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const dateQuery = selectedDate
                ? `?date=${dayjs(selectedDate).format("YYYY-MM-DD")}`
                : "";
            let url = "";

            if (mode === "ALL") {
                console.log("mode ALL");

                url = `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/bookings-management`;
            }

            if (mode === "DATE" && selectedDate) {
                console.log("mode DATE");

                url = `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/booking-today?date=${dayjs(selectedDate).format("YYYY-MM-DD")}`;
            }
            if (mode === "STAYING") {
                console.log("mode ALL");

                url = `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/recent-bookings`;
            }
            const res = await fetch(
                url,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Failed to fetch bookings");

            const data = await res.json();
            console.log("data:", data);

            const bookingList = data?.content || [];


            setBookings(bookingList);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    // useEffect(() => {
    //     fetchRecentBookings(true);
    // }, [filterMode]);

    const fetchRecentBookings = async (reset = false) => {
        if (loading) return;

        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/dashboard/owner/recent-bookings?pageNo=${reset ? 1 : pageNo}&pageSize=${pageSize}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error();

            const data = await res.json();

            let newBookings = data?.content;

            // 🔥 FILTER: booking đang ở
            if (filterMode === "STAYING") {
                const today = dayjs();
                newBookings = newBookings.filter(
                    (b) =>
                        dayjs(b.checkinDate).isSameOrBefore(today, "day") &&
                        dayjs(b.checkoutDate).isSameOrAfter(today, "day")
                );
            }

            setBookings((prev) =>
                reset ? newBookings : [...prev, ...newBookings]
            );

            setHasMore(!data.last);
            setPageNo((prev) => prev + 1);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };


    const handleViewDetail = (bookingId) => {
        history.push(`/dashboard/booking-detail/${bookingId}`);
    };

    const columns = [
        {
            title: "Booking",
            key: "bookingId",
            width: 110,
            fixed: "left",
            render: (_, record) => (
                <Tag color="blue">{record.bookingId}</Tag>
            ),
        },
        {
            title: "Khách hàng",
            dataIndex: "guestFullName",
            key: "guestFullName",
        },
        {
            title: "Khách sạn",
            key: "hotel",
            render: (_, record) => record?.hotelName || "-",
        },
        {
            title: "Phòng",
            key: "room",
            render: (_, record) => record?.roomName || "-",
        },
        {
            title: "Check-in",
            dataIndex: "checkinDate",
            key: "checkinDate",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Check-out",
            dataIndex: "checkoutDate",
            key: "checkoutDate",
            render: (date) => dayjs(date).format("DD/MM/YYYY"),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            align: "right",
            render: (price) => `${price?.toLocaleString()} VNĐ`,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            align: "center",
            render: (status) => (
                <Tag
                    color={
                        status === "PAID" || status === "COMPLETED"
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
            width: 110,
            align: "center",
            render: (_, record) => (
                <Button
                    type="primary"
                    size="middle"
                    icon={<EyeOutlined />}
                    style={{ height: 32 }}
                    onClick={() => handleViewDetail(record.bookingId)}
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <div style={{ padding: 24, background: "#fff", minHeight: "100vh" }}>
                <Space
                    style={{ width: "100%", marginBottom: 16 }}
                    align="center"
                    justify="space-between"
                >
                    <Title level={4} style={{ margin: 0 }}>
                        Quản lý Booking
                    </Title>

                    <Space size="middle">
                        {/* Notification */}
                        <Dropdown
                            overlay={notificationMenu}
                            trigger={["click"]}
                            placement="bottomRight"
                        >
                            <Badge count={unreadCount}>
                                <BellOutlined
                                    style={{
                                        fontSize: 20,
                                        cursor: "pointer",
                                        color: "#1677ff",
                                    }}
                                />
                            </Badge>
                        </Dropdown>

                        {/* Filter by date */}
                        <DatePicker
                            placeholder="Chọn ngày"
                            format="DD/MM/YYYY"
                            onChange={(date) => {
                                setMode("DATE");
                                setSelectedDate(date);
                            }}
                        />

                        <Button
                            icon={<CalendarOutlined />}
                            onClick={() => {
                                setMode("ALL");
                                setSelectedDate(null);
                            }}
                        >
                            Tất cả
                        </Button>
                        <Button
                            type={filterMode === "STAYING" ? "primary" : "default"}
                            onClick={() => {
                                setMode("STAYING");
                                setSelectedDate(null);
                            }}
                        >
                            Đang ở
                        </Button>
                    </Space>

                </Space>


                <Table
                    rowKey="bookingId"
                    loading={loading}
                    columns={columns}
                    dataSource={bookings}
                    pagination={false}
                    size="middle"
                />
            </div>
        </DashboardLayout>
    );
};

export default BookingManagement;
