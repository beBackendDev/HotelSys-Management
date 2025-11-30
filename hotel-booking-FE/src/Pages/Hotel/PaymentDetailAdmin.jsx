import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
    ArrowLeftOutlined,
    DollarOutlined,
    CalendarOutlined,
    FileTextOutlined,
    CreditCardOutlined,
    NumberOutlined,
} from "@ant-design/icons";
import { Card, Descriptions, Tag, Button } from "antd";
import DashboardLayout from "../../core/layout/Dashboard";
import moment from "moment";

const PaymentDetailAdmin = () => {
    const { paymentId } = useParams();
    const history = useHistory();
    const token = localStorage.getItem("accessToken");
    const [payment, setPayment] = useState(null);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/dashboard/admin/hotels/payment/${paymentId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch payment");
                const data = await res.json();
                setPayment(data);
            } catch (error) {
                console.error("Fetch payment error:", error);
            }
        };
        fetchPayment();
    }, [paymentId]);

    if (!payment) return <div>Đang tải...</div>;

    const statusColor = {
        SUCCESS: "green",
        PENDING: "orange",
        FAILED: "red",
    };

    return (
        <DashboardLayout>
            <div className="p-6">
                <Button icon={<ArrowLeftOutlined />} onClick={() => history.goBack()} style={{ marginBottom: 20 }}>
                    Quay lại
                </Button>

                <Card>
                    <Descriptions
                        title={`Thanh toán #${payment.paymentId}`}
                        bordered
                        column={2}
                    >
                        <Descriptions.Item label="Transaction ID">
                            <NumberOutlined /> {payment.transactionId}
                        </Descriptions.Item>
                        <Descriptions.Item label="Booking ID">
                            <NumberOutlined /> {payment.bookingId}
                        </Descriptions.Item>

                        <Descriptions.Item label="Order Info" span={2}>
                            <FileTextOutlined /> {payment.orderInfo}
                        </Descriptions.Item>

                        <Descriptions.Item label="Phương thức thanh toán">
                            <CreditCardOutlined /> {payment.paymentMethod}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số tiền">
                            <DollarOutlined /> {payment.paymentAmount} VND
                        </Descriptions.Item>

                        <Descriptions.Item label="Thời gian tạo">
                            <CalendarOutlined /> {moment(payment.createdAt).format("DD/MM/YYYY HH:mm")}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={statusColor[payment.status]}>{payment.status}</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default PaymentDetailAdmin;
