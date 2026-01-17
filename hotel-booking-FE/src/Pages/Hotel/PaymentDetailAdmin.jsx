import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
    ArrowLeftOutlined,
    DollarOutlined,
    CalendarOutlined,
    PhoneOutlined,
    UserOutlined,
    EditOutlined,
    MailOutlined,
    TeamOutlined,
} from "@ant-design/icons";
import { Card, Descriptions, Tag, Button, Row, Col, Typography } from "antd";
import DashboardLayout from "../../core/layout/Dashboard";
import moment from "moment";
import { formatMoney } from "../../utils/helper";
const { Title, Text } = Typography;


const PaymentDetailAdmin = () => {
    const { paymentId } = useParams();
    const history = useHistory();
    const token = localStorage.getItem("accessToken");
    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const role = decodedToken.role; // ADMIN | OWNER | USER

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
    const [payment, setPayment] = useState(null);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/payment/${paymentId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch payment");
                const data = await res.json();
                console.log("payment dataa:", data);

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
                </div>

                {/* Booking Info Card */}
                <Card style={{ marginBottom: 24 }}>
                    <Title level={4} style={{ marginBottom: 24 }}>
                        Thông tin hóa đơn
                    </Title>
                    <Row gutter={[24, 24]}>
                        {/* Left Column */}
                        <Col xs={24} sm={12} md={6}>
                            <div style={{ marginBottom: 16 }}>
                                {/* Hotel Name */}
                                <Text strong style={{ fontSize: 18, display: "block" }}>
                                    Payment ID: {payment?.paymentId}
                                </Text>

                                {/* Hotel ID */}
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Transaction ID: {payment?.transactionId}
                                </Text>
                            </div>

                
                        </Col>

                        {/* Middle Column */}
                        <Col xs={24} sm={12} md={6}>
                            <div style={{ marginBottom: 16 }}>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                                    <DollarOutlined /> Tổng tiền
                                </Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {`${formatMoney(payment?.paymentAmount)}  VNĐ`}
                                </Text>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                                    <CalendarOutlined /> Ngày tạo
                                </Text>
                                <Text strong style={{ fontSize: 16 }}>
                                    {moment(payment?.createdAt).format("DD/MM/YYYY")}
                                </Text>
                            </div>
                        </Col>

                        {/* Right Column */}
                        <Col xs={24} sm={12} md={6}>
                            <div style={{ marginBottom: 16 }}>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                                    <DollarOutlined /> Phương thức thanh toán
                                </Text>
                                <Text strong style={{ fontSize: 18, color: "#52c41a" }}>
                                    {payment?.paymentMethod}
                                </Text>
                            </div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                                    Trạng thái
                                </Text>
                                <Tag color={statusColor[payment?.status]} style={{ fontSize: 12, padding: "4px 8px" }}>
                                    {payment?.status}
                                </Tag>
                            </div>
                        </Col>
                    </Row>
                </Card>

                
            </div>
        </DashboardLayout>
    );
};

export default PaymentDetailAdmin;
