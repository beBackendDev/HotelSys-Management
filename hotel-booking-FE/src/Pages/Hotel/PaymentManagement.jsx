import {
    Table,
    Tag,
    Typography,
    Button,
    Space,
    Spin,
    Alert,
} from "antd";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import DashboardLayout from "../../core/layout/Dashboard";
//Styles
const tableStyles = {
    header: {
        background: "#f0f7ff",
        fontWeight: 600,
        fontSize: 13,
        color: "#1f2937",
        textTransform: "uppercase",
        borderBottom: "1px solid #e5e7eb",
    }
};

const withHeaderStyle = () => ({
    style: tableStyles.header,
});

//
const { Title } = Typography;

const PaymentManagement = () => {
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

    /* ================= STATE ================= */
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);

    // pagination giống HotelManagement
    const [filters, setFilters] = useState({
        page: 1,
        per_page: 10,
        sort_by: "createdAt",
        order: "desc",
    });

    /* ================= FETCH PAYMENTS ================= */
    useEffect(() => {
        fetchPayments();
    }, [filters]);

    const fetchPayments = async () => {
        setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams({
                pageNo: filters.page, // Spring page = 0
                pageSize: filters.per_page,
                sort: `${filters.sort_by},${filters.order}`,
            });

            const res = await fetch(
                `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/payment-management?${params}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Fetch payments failed");

            const data = await res.json();
            const paymentList = data?.content || [];

            // (OPTIONAL) enrich booking info
            const enriched = await Promise.all(
                paymentList.map(async (p) => {
                    if (!p.bookingId) return p;

                    try {
                        const bookingRes = await fetch(
                            `http://localhost:8080/api/dashboard/${getUrlByRole(
                                role
                            )}/hotels/booking/${p.bookingId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        if (!bookingRes.ok) return p;

                        const bookingData = await bookingRes.json();
                        return { ...p, booking: bookingData };
                    } catch {
                        return p;
                    }
                })
            );

            setPayments(enriched);
            setTotal(data?.totalElements || 0);
        } catch (err) {
            console.error(err);
            setError("Tải danh sách payment thất bại");
        } finally {
            setLoading(false);
        }
    };

    /* ================= STT ================= */
    const paymentsWithStt = useMemo(() => {
        return payments.map((p, index) => ({
            ...p,
            __stt:
                (filters.page - 1) * filters.per_page +
                index +
                1,
        }));
    }, [payments, filters.page, filters.per_page]);

    /* ================= HANDLERS ================= */
    const handleViewDetail = (paymentId) => {
        history.push(`/dashboard/payment-detail/${paymentId}`);
    };

    /* ================= COLUMNS ================= */
    const columns = [
        {
            title: "STT",
            dataIndex: "__stt",
            onHeaderCell: withHeaderStyle,
            key: "__stt",
            width: 70,
            sorter: (a, b) => a.__stt - b.__stt,
        },
        {
            title: "Payment",
            key: "paymentId",
            onHeaderCell: withHeaderStyle,
            fixed: "left",
            render: (_, p) => (
                <Tag color="purple">
                    <div>{p.paymentId}</div>
                    <div className="text-xs text-gray-500">
                        {p.transactionId}
                    </div>
                </Tag>
            ),
        },
        {
            title: "Khách hàng",
            dataIndex: ["booking", "guestFullName"],
            onHeaderCell: withHeaderStyle,
            key: "guestFullName",
            render: (v) => v || "-",
        },
        {
            title: "Tổng tiền",
            dataIndex: "paymentAmount",
            onHeaderCell: withHeaderStyle,
            key: "paymentAmount",
            align: "right",
            render: (p) =>
                p
                    ? `${Number(p).toLocaleString()} VNĐ`
                    : "-",
        },
        {
            title: "Phương thức",
            dataIndex: "paymentMethod",
            onHeaderCell: withHeaderStyle,
            key: "paymentMethod",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            onHeaderCell: withHeaderStyle,
            key: "status",
            render: (s) => (
                <Tag
                    color={
                        s === "SUCCESS"
                            ? "green"
                            : s === "PENDING"
                                ? "orange"
                                : s === "FAILED"
                                    ? "volcano"
                                    : "default"
                    }
                >
                    {s}
                </Tag>
            ),
        },
        {
            title: "Ngày thanh toán",
            onHeaderCell: withHeaderStyle,
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => date ? moment(date).format("DD/MM/YYYY") : "-",
        },
        {
            title: "Hành động",
            onHeaderCell: withHeaderStyle,
            key: "action",
            render: (_, r) => (
                <Button
                    icon={<EyeOutlined />}
                    onClick={() =>
                        handleViewDetail(r.paymentId)
                    }
                >
                    Chi tiết
                </Button>
            ),
        },
    ];

    /* ================= RENDER ================= */
    return (
        <DashboardLayout>
            <div className="p-6 bg-white min-h-screen">
                <Title level={3}>Quản lý Payment</Title>

                {error && (
                    <Alert
                        type="error"
                        message={error}
                        showIcon
                        className="mb-4"
                    />
                )}

                <Spin spinning={loading}>
                    <Table
                        rowKey="paymentId"
                        columns={columns}
                        dataSource={paymentsWithStt}
                        pagination={{
                            current: filters.page,
                            pageSize: filters.per_page,
                            total,
                            showSizeChanger: true,
                            onChange: (page, per_page) =>
                                setFilters((f) => ({
                                    ...f,
                                    page,
                                    per_page,
                                })),
                        }}
                        onChange={(pagination, _f, sorter) => {
                            if (sorter.field) {
                                setFilters((f) => ({
                                    ...f,
                                    sort_by: sorter.field,
                                    order:
                                        sorter.order === "ascend"
                                            ? "asc"
                                            : "desc",
                                }));
                            }
                        }}
                    />
                </Spin>
            </div>
        </DashboardLayout>
    );
};

export default PaymentManagement;
