import {
    Table,
    Tag,
    Typography,
    Button,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import DashboardLayout from "../../core/layout/Dashboard";

const { Title } = Typography;

const ReviewManagement = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([]);

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
            title: "Review ID",
            key: "id",
            render: (_, review) => (
                <Tag color="blue">{review.id}</Tag>
            ),
        },
        {
            title: "Người đánh giá",
            key: "hotelId",
            render: (_, review) =>review?.fullName || "-",
        },
        {
            title: "Tên khách sạn",
            key: "hotelName",
            render: (_, review) => review.hotelName || "-",
        },
        {
            title: "Rating",
            dataIndex: "ratingPoint",
            key: "ratingPoint",
            render: (rating) => (
                <Tag color="gold">{rating} ⭐</Tag>
            ),
        },

        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => date ? new Date(date).toLocaleString() : "-",
        },
        {
            title: "Thao tác",
            key: "action",
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
                    dataSource={reviews}
                    pagination={false}
                />
            </div>
        </DashboardLayout>
    );
};

export default ReviewManagement;
