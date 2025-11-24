import {
    Table,
    Input,
    Select,
    Space,
    Button,
    Tag,
    Typography,
} from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import qs from "query-string";
import DashboardLayout from "../../core/layout/Dashboard";
import axios from "axios";

const { Option } = Select;
const { Title } = Typography;

const BookingManagement = () => {
    const { hotel } = useSelector((state) => state.auth.profile);
    const history = useHistory();
    const location = useLocation();

    const query = qs.parse(location.search);
    const page = parseInt(query.page) || 1;
    const status = query.status || "";
    const guestName = query.guestName || "";

    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [totalElements, setTotalElements] = useState(0);

    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchBookings();
    }, [page, status, guestName]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:8080/api/dashboard/admin/hotels/bookings-management`,
                {
                    params: {
                        page: page - 1,
                        size: 10,
                        hotelId: hotel.id,
                        status,
                        guestName,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setBookings(res.data.content);
            setTotalElements(res.data.totalElements);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
        setLoading(false);
    };

    // Update URL dynamically
    const updateFilter = (field, value) => {
        const filters = {
            page: 1,
            status,
            guestName,
            [field]: value,
        };
        history.push(`/dashboard/booking-management?${qs.stringify(filters)}`);
    };

    const columns = [
        {
            title: "Booking ID",
            dataIndex: "bookingId",
            key: "bookingId",
            render: (id) => <Tag color="blue">{id}</Tag>,
            width: 100,
        },
        {
            title: "Họ và tên",
            dataIndex: "guestFullName",
            key: "guestFullName",
        },
        {
            title: "Số điện thoại",
            dataIndex: "guestPhone",
            key: "guestPhone",
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
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag
                    color={
                        status === "CONFIRMED"
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
    ];

    return (
        <DashboardLayout>
            <div style={{ padding: "16px", background: "#fff", minHeight: "100vh" }}>
                <Title level={3} style={{ marginBottom: "16px" }}>
                    Quản lý Booking
                </Title>

                {/* 🔍 Filter Section */}
                <Space style={{ marginBottom: 16 }}>
                    <Input
                        placeholder="Tìm tên khách"
                        value={guestName}
                        onChange={(e) => updateFilter("guestName", e.target.value)}
                        prefix={<SearchOutlined />}
                        allowClear
                        style={{ width: 200 }}
                    />

                    <Select
                        placeholder="Chọn trạng thái"
                        value={status}
                        onChange={(v) => updateFilter("status", v)}
                        allowClear
                        style={{ width: 160 }}
                    >
                        <Option value="PENDING">PENDING</Option>
                        <Option value="CONFIRMED">CONFIRMED</Option>
                        <Option value="COMPLETED">COMPLETED</Option>
                        <Option value="CANCELLED">CANCELLED</Option>
                    </Select>

                    <Button
                        icon={<ReloadOutlined />}
                        onClick={() =>
                            history.push("/dashboard/booking-management?page=1")
                        }
                    >
                        Reset
                    </Button>
                </Space>

                {/* 📋 Table Bookings */}
                <Table
                    rowKey="bookingId"
                    loading={loading}
                    columns={columns}
                    dataSource={bookings}
                    pagination={{
                        current: page,
                        pageSize: 10,
                        total: totalElements,
                        onChange: (p) => updateFilter("page", p),
                    }}
                />
            </div>
        </DashboardLayout>
    );
};

export default BookingManagement;
