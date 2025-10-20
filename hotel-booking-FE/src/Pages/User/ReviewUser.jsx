import { Col, Row, Typography, Pagination } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import User from "./User";
import PurchaseCard from "../../components/ReviewCard/ReviewCard";
import { jwtDecode } from "jwt-decode";
import ReviewCard from "../../components/ReviewCard/ReviewCard";

const ReviewUser = () => {
    const { user } = useSelector((state) => state.auth.profile);
    const [reviewList, setReviewList] = useState([]);

    const [pagination, setPagination] = useState({
        pageNo: 1,
        pageSize: 5,
        totalPage: 1,
        totalElements: 0,
    });

    const token = localStorage.getItem("accessToken");
    let Id = null;
    if (token) {
        const decoded = jwtDecode(token);
        console.log("(ReviewUser)Decoded JWT Token: ", decoded?.userId);
        Id = decoded?.userId;


    }   
    const fetchReviews = async (pageNo, pageSize) => {
        try {
            if (Id != null) {
                const res = await fetch(
                    `http://localhost:8080/api/user/user/${Id}/reviews-list?pageNo=${pageNo - 1}&pageSize=${pageSize}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();
                console.log("(ReviewUser)Reviews: ", data.content);

                setReviewList(data?.content || []);
                setPagination((prev) => ({
                    ...prev,
                    pageNo,
                    pageSize,
                    totalPage: data.totalPage,
                    totalElements: data.totalElements,
                }));
            }
            else {
                alert("Phiên đăng nhập hết hạn, Vui lòng đăng nhập lại");

            }
        } catch (error) {
            console.error("Lỗi lấy đơn đặt:", error);
        }
    };

    // fetch lần đầu khi component mount
    useEffect(() => {
        fetchReviews(pagination.pageNo, pagination.pageSize);
    }, []);

    const handlePageChange = (page, pageSize) => {
        fetchReviews(page, pageSize);
    };

    return (
        <User>
            <div className="px-8 bg-white min-h-screen rounded py-12">
                <Typography.Title level={3} className="pt-5">
                    Lịch sử đánh giá
                </Typography.Title>

                <Row gutter={[24, 24]} className="bg-orange-200 p-4">
                    <Col sm={8}>
                        <Typography.Text className="font-bold">Khách sạn</Typography.Text>
                    </Col>
                    <Col sm={3}>
                        <Typography.Text className="font-bold">Điểm đánh giá</Typography.Text>
                    </Col>
                    <Col sm={9}>
                        <Typography.Text className="font-bold">Nội dung</Typography.Text>
                    </Col>
                    <Col sm={4}>
                        <Typography.Text className="font-bold">Ngày đánh giá</Typography.Text>
                    </Col>
                </Row>

                {reviewList.map((review) => (
                    <ReviewCard
                        review={review}
                        key={review.id}
                    />
                ))}

                <div className="flex justify-center mt-6">
                    <Pagination
                        current={pagination.pageNo}
                        pageSize={pagination.pageSize}
                        total={pagination.totalElements}
                        onChange={handlePageChange}
                        showSizeChanger={false}
                    />
                </div>
            </div>
        </User>
    );
};

export default ReviewUser;
