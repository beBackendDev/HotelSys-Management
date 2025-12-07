import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Rate, Input, Button, message, Typography, Divider } from "antd";
import { path } from "../../constant/path";
import HomeLayout from "../../core/layout/HomeLayout";

const { TextArea } = Input;

const ReviewPage = () => {
  const { bookingId } = useParams();
  const token = localStorage.getItem("accessToken");
  const [booking, setBooking] = useState(null);
  const [ratingPoint, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("rating point: ", ratingPoint);
  
  // 🔹 Fetch booking info
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/user/hotels/booking/${bookingId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Không thể tải thông tin đặt phòng");

        const data = await res.json();
        setBooking(data);
      } catch (err) {
        message.error(err.message);
      }
    };

    fetchBooking();
  }, [bookingId, token]);

  // 🔹 Submit review
  const handleSubmit = async () => {
    if (!ratingPoint) {
      message.warning("Vui lòng chọn số sao đánh giá!");
      return;
    }
    if (!comment.trim()) {
      message.warning("Vui lòng nhập nội dung nhận xét!");
      return;
    }

    setLoading(true);

    try {
      const userStr = localStorage.getItem("user");
      const user = JSON.parse(userStr);

      const payload = {
        hotelId: booking?.hotelId,
        userId: user?.userId,
        ratingPoint,
        comment,
        createdAt: new Date(),
      };

      const res = await fetch("http://localhost:8080/api/user/hotels/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gửi đánh giá thất bại!");

      message.success("Cảm ơn bạn đã đánh giá!");

      setTimeout(() => {
        window.location.href = path.home;
      }, 1200);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!booking)
    return (
      <HomeLayout>
        <p className="text-center mt-10">Đang tải thông tin...</p>
      </HomeLayout>
    );

  return (
    <HomeLayout>
      <div className="max-w-3xl mx-auto mt-20 px-4">
        <Card
          className="shadow-lg rounded-xl border border-gray-200"
          title={
            <div className="text-lg font-semibold text-gray-700">
              ⭐ Đánh giá khách sạn:{" "}
              <span className="text-orange-600">{booking?.hotelName}</span>
            </div>
          }
        >
          {/* Booking Summary */}
          <div className="mb-4">
            <Typography.Paragraph className="text-gray-600">
              <span className="block mb-1">
                <b>Phòng:</b> {booking?.roomName}
              </span>
              <span>
                <b>Thời gian lưu trú:</b> {booking?.checkinDate} →{" "}
                {booking?.checkoutDate}
              </span>
            </Typography.Paragraph>
          </div>

          <Divider />

          {/* Rating */}
          <div className="flex flex-col items-start mb-4">
            <Typography.Text className="font-medium text-gray-700 mb-1">
              Mức độ hài lòng:
            </Typography.Text>
            <Rate value={ratingPoint} onChange={setRating} allowHalf />
          </div>

          {/* Comment */}
          <Typography.Text className="font-medium text-gray-700">
            Nhận xét:
          </Typography.Text>
          <TextArea
            rows={5}
            placeholder="Hãy chia sẻ trải nghiệm của bạn với khách sạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-2"
          />

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleSubmit}
              className="px-10 rounded-lg bg-orange-500 hover:bg-orange-600"
            >
              Gửi đánh giá
            </Button>
          </div>
        </Card>
      </div>
    </HomeLayout>
  );
};

export default ReviewPage;
