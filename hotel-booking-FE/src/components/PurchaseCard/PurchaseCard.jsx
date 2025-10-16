import { Button, Col, Row, Typography } from "antd";
import { formatDate, formatMoney } from "../../utils/helper";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const PurchaseCard = ({ purchase }) => {
  const token = localStorage.getItem("accessToken");
  const checkin = formatDate(purchase.checkinDate).slice(-2);
  const checkout = formatDate(purchase.checkoutDate).slice(-2);
  const hotelId = purchase?.hotelId || null;
  const [hotel, setHotel] = useState([]); // danh sách phòng

  const roomId = purchase?.roomId || null;
  const [room, setRooms] = useState([]); // danh sách phòng

  const price = (checkout - checkin) * purchase.totalPrice;//sai

  const history = useHistory();
  const handleReview = (bookingId) => {
    history.push(`/user/review/${bookingId}`);
  };
  useEffect(() => {
    const getHotel = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/user/public/hotels/${hotelId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            }
          }

        );
        const data = await res.json();
        // console.log("(PurchaseCard)API-Hotel:", data);
        setHotel(data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin khách sạn:", err);
      }
    };
    const getRoom = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/user/public/hotels/${hotelId}/rooms/${roomId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            }
          }

        );
        const data = await res.json();
        // console.log("(PurchaseCard)API-Room", data);
        setRooms(data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin phòng:", err);
      }
    };
    getHotel();
    getRoom();
  }, [hotelId, roomId, token]);
  return (
    <>
      <Row gutter={[24, 24]} className="px-5 py-10 rounded bg-gray-100 mt-4">
        <Col sm={5}>
          <Typography.Text>{hotel.hotelName}</Typography.Text>
        </Col>

        <Col sm={3}>
          <Typography.Text>{room.roomName}</Typography.Text>
        </Col>
        <Col sm={3}>
          <Typography.Text>
            {formatDate(purchase.checkinDate)}
          </Typography.Text>
        </Col>
        <Col sm={3}>
          <Typography.Text>
            {formatDate(purchase.checkoutDate)}
          </Typography.Text>
        </Col>
        <Col sm={4}>
          <Typography.Text>{purchase.status}</Typography.Text>
        </Col>
        <Col sm={3}>
          <Typography.Text>{formatMoney(purchase.totalPrice)} (VNĐ)</Typography.Text>
        </Col>
        <Col sm={3}>
          <Button
            type="primary"
            disabled={!purchase.canReview}
            onClick={() => handleReview(purchase?.bookingId)}
          >
            {purchase?.canReview ? "Đánh giá" : "Hết hạn"}

          </Button>
        </Col>
      </Row>
    </>
  );
};

export default PurchaseCard;
