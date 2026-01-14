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
import {
    EyeOutlined,
    CalendarOutlined,
    BellOutlined,
} from "@ant-design/icons";

import React, {
    useEffect,
    useState,
    useMemo,
    useRef,
} from "react";
import { useHistory } from "react-router-dom";
import DashboardLayout from "../../core/layout/Dashboard";
// WebSocket
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);




const { Title } = Typography;

const BookingManagement = () => {
    const history = useHistory();
    const stompClientRef = useRef(null);

    /* ================= STATE ================= */
    const [bookings, setBookings] = useState([]);
    const [notifications, setNotifications] = useState([]);

    const [loadingBookings, setLoadingBookings] = useState(false);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const [mode, setMode] = useState("ALL"); // ALL | DATE | STAYING
    const [selectedDate, setSelectedDate] = useState(null);

    const token = localStorage.getItem("accessToken");
    const [filters, setFilters] = useState({
        page: 1,
        per_page: 7,
    });
    const [total, setTotal] = useState(0);


    /* ================= TOKEN ================= */
    const role = useMemo(() => {
        if (!token) return null;
        try {
            return JSON.parse(atob(token.split(".")[1])).role;
        } catch {
            return null;
        }
    }, [token]);
    const bookingsWithStt = useMemo(() => {
        return bookings.map((b, index) => ({
            ...b,
            __stt: (filters.page - 1) * filters.per_page + index +1,
        }));
    }, [bookings, filters.page, filters.per_page]);


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


    /* ================= WEBSOCKET ================= */
    useEffect(() => {
        if (!token) return;

        const client = new Client({
            webSocketFactory: () =>
                new SockJS(`http://localhost:8080/ws?token=${token}`),
            debug: () => { },
            onConnect: () => {
                console.log("✅ WebSocket connected");

                client.subscribe("/user/queue/notifications", (message) => {
                    const noti = JSON.parse(message.body);
                    setNotifications((prev) => [noti, ...prev]);
                });
            },
            onStompError: (frame) => {
                console.error("❌ STOMP error:", frame.headers["message"]);
            },
        });


        client.activate();
        stompClientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [token]);

    /* ================= FETCH NOTIFICATIONS ================= */
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoadingNotifications(true);
        try {
            const res = await fetch(
                "http://localhost:8080/api/dashboard/owner/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Fetch notifications failed");

            const data = await res.json();

            // ❗ merge DB + realtime (không overwrite)
            setNotifications((prev) => {
                const map = new Map();
                prev.forEach((n) => map.set(n.notifyId, n));
                data.forEach((n) => map.set(n.notifyId, n));
                return Array.from(map.values()).sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                );
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingNotifications(false);
        }
    };

    /* ================= FETCH BOOKINGS ================= */
    useEffect(() => {
        fetchBookings();
    }, [mode, selectedDate, filters]);

    const fetchBookings = async () => {
        setLoadingBookings(true);
        try {
            let url = "";
            let params = new URLSearchParams({
                pageNo: filters.page, // Spring = 0
                pageSize: filters.per_page,
            });
            if (mode === "ALL") {
                url = `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/bookings-management`;
            }

            if (mode === "DATE" && selectedDate) {
                url = `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/booking-today?date=${dayjs(
                    selectedDate
                ).format("YYYY-MM-DD")}`;
            }

            if (mode === "STAYING") {
                url = `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/recent-bookings`;
            }

            const res = await fetch(`${url}?${params}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Fetch bookings failed");

            const data = await res.json();
            setBookings(data?.content || []);
            setTotal(data?.totalElements || 0);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingBookings(false);
        }
    };

    /* ================= UI ================= */
    const unreadCount = notifications.filter(
        (n) => !n.isRead
    ).length;

    const notificationMenu = (
        <div
            style={{
                width: 360,
                maxHeight: 420,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* ===== Header ===== */}
            <div
                style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0f0f0",
                    fontWeight: 600,
                    fontSize: 15,
                }}
            >
                🔔 Thông báo
            </div>

            {/* ===== List ===== */}
            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                }}
            >
                <List
                    loading={loadingNotifications}
                    dataSource={notifications}
                    locale={{ emptyText: "Không có thông báo" }}
                    renderItem={(noti) => (
                        <List.Item
                            key={noti.notifyId}
                            style={{
                                padding: "12px 16px",
                                background: noti.isRead
                                    ? "#fff"
                                    : "#f6faff",
                                cursor: "pointer",
                            }}
                        >
                            <div style={{ width: "100%" }}>
                                <Space align="start">
                                    {/* chấm unread */}
                                    {!noti.isRead && (
                                        <span
                                            style={{
                                                width: 8,
                                                height: 8,
                                                marginTop: 6,
                                                borderRadius: "50%",
                                                background: "#1677ff",
                                                display: "inline-block",
                                            }}
                                        />
                                    )}

                                    <div>
                                        <Typography.Text strong>
                                            {noti.title}
                                        </Typography.Text>

                                        <div
                                            style={{
                                                fontSize: 13,
                                                color: "#666",
                                                marginTop: 2,
                                            }}
                                        >
                                            {noti.content}
                                        </div>

                                        <div
                                            style={{
                                                fontSize: 11,
                                                color: "#999",
                                                marginTop: 4,
                                            }}
                                        >
                                            {dayjs(noti.createdAt).fromNow()}
                                        </div>
                                    </div>
                                </Space>
                            </div>
                        </List.Item>
                    )}
                />
            </div>

            {/* ===== Footer ===== */}
            <div
                style={{
                    padding: 10,
                    textAlign: "center",
                    borderTop: "1px solid #f0f0f0",
                }}
            >
                <Button
                    type="link"
                    size="small"
                    onClick={() =>
                        history.push("/dashboard/owner/notifications")
                    }
                >
                    Xem tất cả
                </Button>
            </div>
        </div>
    );


    const columns = [
        {
            title: "STT",
            dataIndex: "__stt",
            key: "__stt",
            width: 70,
            sorter: (a, b) => a.__stt - b.__stt,
            sortDirections: ["ascend", "descend"],
        },

        {
            title: "Tên phòng",
            dataIndex: "roomName",
        },
        {
            title: "Booking",
            render: (_, r) => (
                <Tag color="blue">{r.bookingId}</Tag>
            ),
        },
        { title: "Khách", dataIndex: "guestFullName" },
        { title: "Khách sạn", dataIndex: "hotelName" },
        { title: "Phòng", dataIndex: "roomName" },
        {
            title: "Check-in",
            dataIndex: "checkinDate",
            render: (d) => dayjs(d).format("DD/MM/YYYY"),
        },
        {
            title: "Check-out",
            dataIndex: "checkoutDate",
            render: (d) => dayjs(d).format("DD/MM/YYYY"),
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            align: "right",
            render: (p) =>
                `${p?.toLocaleString()} VNĐ`,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            align: "center",
            render: (s) => (
                <Tag color={s === "PAID" ? "green" : "orange"}>
                    {s}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            render: (_, r) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() =>
                        history.push(
                            `/dashboard/booking-detail/${r.bookingId}`
                        )
                    }
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    return (
        <DashboardLayout>
            <div style={{ padding: 24, background: "#fff" }}>
                <Space
                    style={{
                        width: "100%",
                        marginBottom: 16,
                        justifyContent: "space-between",
                    }}
                >
                    <Title level={4}>Quản lý Booking</Title>

                    <Space>
                        <DatePicker
                            onChange={(d) => {
                                setMode("DATE");
                                setSelectedDate(d);
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
                            icon={<CalendarOutlined />}
                            onClick={() => {
                                setMode("STAYING");
                                setSelectedDate(null);
                            }}
                        >
                            Hôm nay
                        </Button>
                        <Dropdown
                            overlay={notificationMenu}
                            trigger={["click"]}
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
                    </Space>
                </Space>

                <Table
                    rowKey="bookingId"
                    loading={loadingBookings}
                    columns={columns}
                    dataSource={bookingsWithStt}
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
                                        page:1,
                                        sort_by: sorter.field,
                                        order: sorter.order === "ascend" ? "asc" : "desc",
                                    }));
                                }
                            }}
                />
            </div>
        </DashboardLayout>
    );
};

export default BookingManagement;
