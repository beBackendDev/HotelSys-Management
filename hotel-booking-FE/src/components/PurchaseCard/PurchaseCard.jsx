import { Button, Col, Row, Typography, Tag, Card, Divider } from "antd";
import { formatDate, formatMoney } from "../../utils/helper";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const PurchaseCard = ({ purchase }) => {
  const token = localStorage.getItem("accessToken");
  const history = useHistory();

  const [hotel, setHotel] = useState({});
  const [room, setRoom] = useState({});

  const statusConfig = {
    COMPLETED: { color: "green", label: "Hoàn thành" },
    CANCELLED: { color: "red", label: "Đã hủy" },
    PENDING: { color: "orange", label: "Đang xử lý" },
  };

  const handleReview = () => {
    history.push(`/user/review/${purchase.bookingId}`);
  };

  useEffect(() => {
    if (!purchase) return;

    fetch(`http://localhost:8080/api/user/public/hotels/${purchase.hotelId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setHotel);

    fetch(
      `http://localhost:8080/api/user/public/hotels/${purchase.hotelId}/rooms/${purchase.roomId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((r) => r.json())
      .then(setRoom);
  }, [purchase, token]);

  return (
    <Card
      className="rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
      bodyStyle={{ padding: 20 }}
    >
      {/* Header */}
      <Row justify="space-between" align="middle">
        <Col>
          <Typography.Title level={5} className="mb-0">
            {hotel.hotelName}
          </Typography.Title>
          <Typography.Text type="secondary">
            Phòng: {room.roomName}
          </Typography.Text>
        </Col>

        <Col>
          <Tag
            color={statusConfig[purchase.status]?.color}
            className="px-4 py-1 text-sm font-medium"
          >
            {statusConfig[purchase.status]?.label}
          </Tag>
        </Col>
      </Row>

      <Divider className="my-4" />

      {/* Info */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Typography.Text type="secondary">Check-in</Typography.Text>
          <div className="font-medium">
            {formatDate(purchase.checkinDate)}
          </div>
        </Col>

        <Col xs={24} sm={8}>
          <Typography.Text type="secondary">Check-out</Typography.Text>
          <div className="font-medium">
            {formatDate(purchase.checkoutDate)}
          </div>
        </Col>

        <Col xs={24} sm={8}>
          <Typography.Text type="secondary">Tổng tiền</Typography.Text>
          <div className="font-bold text-lg text-red-500">
            {formatMoney(purchase.totalPrice)} VNĐ
          </div>
        </Col>
      </Row>

      {/* Action */}
      <Row justify="end" className="mt-5">
        <Button
          type="primary"
          disabled={!purchase.canReview}
          onClick={handleReview}
          className="min-w-[140px] h-[40px] font-medium"
        >
          {purchase.canReview ? "Đánh giá" : "Không thể đánh giá"}
        </Button>
      </Row>
    </Card>
  );
};

export default PurchaseCard;
