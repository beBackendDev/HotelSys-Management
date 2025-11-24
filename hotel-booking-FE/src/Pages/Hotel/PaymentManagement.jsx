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

const PaymentManagement = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/dashboard/admin/payments-management`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            if (!res.ok) throw new Error("Failed to fetch payments.");
            const data = await res.json();
            const paymentList = data?.content || [];

            // Gọi API lấy thêm thông tin Booking nếu cần
            const updatedPayments = await Promise.all(
                paymentList.map(async (payment) => {
                    if (!payment.booking?.bookingId) return payment;

                    const bookingRes = await fetch(
                        `http://localhost:8080/api/dashboard/admin/bookings/${payment.booking.bookingId}`,
                        {
                            headers: {
                                "Authorization": `Bearer ${token}`,
                            },
                        }
                    );
                    const bookingData = await bookingRes.json();

                    return { ...payment, booking: bookingData };
                })
            );

            setPayments(updatedPayments);
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (paymentId) => {
        history.push(`/dashboard/payment-management/${paymentId}`);
    };

    const columns = [
        {
            title: "Payment ID",
            dataIndex: "paymentId",
            key: "paymentId",
            render: (id) => <Tag color="blue">{id}</Tag>,
            fixed: "left",
        },
        {
            title: "Booking ID",
            dataIndex: ["booking", "bookingId"],
            key: "bookingId",
            render: (id) => <Tag color="purple">{id}</Tag>,
        },
        {
            title: "Khách hàng",
            dataIndex: ["booking", "guestFullName"],
            key: "guestFullName",
        },
        {
            title: "Số điện thoại",
            dataIndex: ["booking", "guestPhone"],
            key: "guestPhone",
        },
        {
            title: "Tổng tiền",
            dataIndex: "paymentAmount",
            key: "paymentAmount",
            render: (price) => price ? `${parseFloat(price).toLocaleString()} VNĐ` : "-",
        },
        {
            title: "Phương thức",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag
                    color={
                        status === "SUCCESS" ? "green" :
                        status === "PENDING" ? "orange" :
                        status === "FAILED" ? "volcano" : "blue"
                    }
                >
                    {status}
                </Tag>
            ),
        },
        {
            title: "Ngày thanh toán",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => date ? new Date(date).toLocaleString() : "-",
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(record.paymentId)}
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
                    Quản lý Payment
                </Title>

                <Table
                    rowKey="paymentId"
                    loading={loading}
                    columns={columns}
                    dataSource={payments}
                    pagination={false}
                
                />
            </div>
        </DashboardLayout>
    );
};

export default PaymentManagement;
