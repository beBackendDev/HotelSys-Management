import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Rate, Input, Button, message, Typography } from "antd";
import { path } from "../../constant/path";

const { TextArea } = Input;

const ReviewPage = () => {
  const { bookingId } = useParams();
  const token = localStorage.getItem("accessToken");
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Lấy thông tin booking để hiển thị
//   useEffect(() => {
//     const fetchBooking = async () => {
//       try {
//         const res = await fetch(`http://localhost:8080/api/user/bookings/${bookingId}`, {
//           headers: {
//             "Authorization": `Bearer ${token}`,
//           },
//         });
//         if (!res.ok) throw new Error("Không thể tải thông tin đặt phòng");
//         const data = await res.json();
//         setBooking(data);
//       } catch (err) {
//         message.error(err.message);
//       }
//     };
//     fetchBooking();
//   }, [bookingId, token]);

  // 🔹 Gửi đánh giá
  const handleSubmit = async () => {
    if (!rating) {
      message.warning("Vui lòng chọn số sao đánh giá!");
      return;
    }
    if (!comment.trim()) {
      message.warning("Vui lòng nhập nội dung nhận xét!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/user/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId,
          rating,
          comment,
        }),
      });

      if (!res.ok) throw new Error("Gửi đánh giá thất bại!");

      message.success("Cảm ơn bạn đã đánh giá!");
      // 👇 Thay vì navigate("/purchases")
      setTimeout(() => {
        window.location.href = path.reviewPage;
      }, 1200);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

//   if (!booking) return <p>Đang tải thông tin...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Card title={`Đánh giá khách sạn: ${booking?.hotelName || ""}`}>
        <Typography.Paragraph>
          Phòng: <b>{booking?.roomName}</b><br />
          Thời gian lưu trú: <b>{booking?.checkinDate}</b> - <b>{booking?.checkoutDate}</b>
        </Typography.Paragraph>

        <Rate value={rating} onChange={setRating} />
        <TextArea
          rows={5}
          placeholder="Nhập nhận xét của bạn về khách sạn này..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-3"
        />

        <div className="flex justify-end mt-5">
          <Button type="primary" loading={loading} onClick={handleSubmit}>
            Gửi đánh giá
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ReviewPage;
