import { Button, Col, Row, Typography, Tag, Card } from "antd";
import { formatDate, formatMoney } from "../../utils/helper";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const PurchaseCard = ({ purchase }) => {
  const token = localStorage.getItem("accessToken");
  const hotelId = purchase?.hotelId;
  const roomId = purchase?.roomId;

  const [hotel, setHotel] = useState({});
  const [room, setRooms] = useState({});

  const history = useHistory();
  const handleReview = (bookingId) => {
    history.push(`/user/review/${bookingId}`);
  };

  const statusColor = {
    COMPLETED: "green",
    CANCELLED: "red",
    PENDING: "orange",
  };

  useEffect(() => {
    const getHotel = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/user/public/hotels/${hotelId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHotel(await res.json());
      } catch (err) {
        console.error("Lỗi khi lấy thông tin khách sạn:", err);
      }
    };

    const getRoom = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/user/public/hotels/${hotelId}/rooms/${roomId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRooms(await res.json());
      } catch (err) {
        console.error("Lỗi khi lấy thông tin phòng:", err);
      }
    };

    getHotel();
    getRoom();
  }, [hotelId, roomId, token]);

  return (
    <Card
      className="w-full rounded-xl shadow-md hover:shadow-lg transition-all"
      bodyStyle={{ padding: "20px" }}
    >
      <Row gutter={[16, 16]} align="middle">
        {/* Hotel Name */}
        <Col sm={6}>
          <Typography.Title level={5} className="mb-1">
            {hotel.hotelName}
          </Typography.Title>
          <Typography.Text type="secondary">
            Phòng: {room.roomName}
          </Typography.Text>
        </Col>

        {/* Check-in */}
        <Col sm={4}>
          <Typography.Text type="secondary">Check-in</Typography.Text>
          <div>
            <Tag color="blue" className="mt-1 text-base px-3 py-1">
              {formatDate(purchase.checkinDate)}
            </Tag>
          </div>
        </Col>

        {/* Check-out */}
        <Col sm={4}>
          <Typography.Text type="secondary">Check-out</Typography.Text>
          <div>
            <Tag color="blue" className="mt-1 text-base px-3 py-1">
              {formatDate(purchase.checkoutDate)}
            </Tag>
          </div>
        </Col>

        {/* Status */}
        <Col sm={4}>
          <Typography.Text type="secondary">Trạng thái</Typography.Text>
          <div>
            <Tag
              color={statusColor[purchase.status] || "default"}
              className="mt-1 text-base px-4 py-1"
            >
              {purchase.status}
            </Tag>
          </div>
        </Col>

        {/* Price */}
        <Col sm={4}>
          <Typography.Text type="secondary">Tổng tiền</Typography.Text>
          <div className="mt-1 font-semibold text-lg">
            {formatMoney(purchase.totalPrice)} VNĐ
          </div>
        </Col>

        {/* Action */}
        <Col sm={4} className="text-right">
          <Button
            type="primary"
            disabled={!purchase.canReview}
            onClick={() => handleReview(purchase.bookingId)}
            style={{ width: "100%", height: 40, fontWeight: 500 }}
          >
            {purchase.canReview ? "Đánh giá" : "Không thể đánh giá"}
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default PurchaseCard;
