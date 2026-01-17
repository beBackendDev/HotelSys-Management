import {
    Table,
    Tag,
    Typography,
    Button,
} from "antd";
import moment from "moment";


import { EyeOutlined } from "@ant-design/icons";
import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import DashboardLayout from "../../core/layout/Dashboard";
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
const { Title } = Typography;

const ReviewManagement = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [filters, setFilters] = useState({
        page: 1,
        per_page: 7,
    });
        const [total, setTotal] = useState(0);
    
    const reviewsWithStt = useMemo(() => {
        return reviews.map((b, index) => ({
            ...b,
            __stt: (filters.page - 1) * filters.per_page + index + 1,
        }));
    }, [reviews, filters.page, filters.per_page]);
    const token = localStorage.getItem("accessToken");
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // decode JWT
    const role = decodedToken.role; // ADMIN, OWNER, USER

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
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/reviews-list`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Failed to fetch reviews.");
            const data = await res.json();
            const reviewList = data?.content || [];
            console.log("review data: ", reviewList);


            // Nếu muốn load thêm thông tin hotel để hiển thị
            // const updatedReviews = await Promise.all(
            //     reviewList.map(async (review) => {
            //         if (!review.hotelId) return review;

            //         const hotelRes = await fetch(
            //             `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${review.hotelId}`,
            //             {
            //                 headers: { "Authorization": `Bearer ${token}` },
            //             }
            //         );

            //         const hotelData = hotelRes.ok ? await hotelRes.json() : null;
            //         return { ...review, hotel: hotelData };
            //     })
            // );

            setReviews(reviewList);
            setTotal(data?.totalElements || 0);

        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (reviewId) => {
        history.push(`/dashboard/review-detail/${reviewId}`);
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "__stt",
            onHeaderCell: withHeaderStyle,
            key: "__stt",
            width: 70,
            sorter: (a, b) => a.__stt - b.__stt,
            sortDirections: ["ascend", "descend"],
        },
        {
            title: "Người đánh giá",
            onHeaderCell: withHeaderStyle,
            key: "hotelId",
            render: (_, review) => review?.fullName || "-",
        },
        {
            title: "Tên khách sạn",
            key: "hotelName",
            onHeaderCell: withHeaderStyle,
            render: (_, review) => review.hotelName || "-",
        },
        {
            title: "Rating",
            dataIndex: "ratingPoint",
            onHeaderCell: withHeaderStyle,
            key: "ratingPoint",
            render: (rating) => (
                <Tag color="gold">{rating} ⭐</Tag>
            ),
        },

        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            onHeaderCell: withHeaderStyle,
            key: "createdAt",
            render: (date) => date ? moment(date).format("DD/MM/YYYY") : "-",
        },
        {
            title: "Thao tác",
            key: "action",
            onHeaderCell: withHeaderStyle,
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => handleViewDetail(record.id)}
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
                    Quản lý Review
                </Title>

                <Table
                    rowKey="id"
                    loading={loading}
                    columns={columns}
                    dataSource={reviewsWithStt}
                    pagination={
                       {
                         current: filters.page,
                        pageSize: filters.per_page,
                        total,
                        showSizeChanger: true,
                        onChange: (page, per_page) =>
                            setFilters((f) => ({ ...f, page, per_page })),
                    }
                    }
                />
            </div>
        </DashboardLayout>
    );
};

export default ReviewManagement;
