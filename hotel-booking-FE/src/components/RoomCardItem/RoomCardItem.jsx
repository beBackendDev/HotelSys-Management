import { Button, Tag, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { typeOfRoom } from "../../constant/common";
import { formatMoney } from "../../utils/helper";

const RoomCardItem = ({ room }) => {
  console.log("(roomItem)", JSON.stringify(room));
  const token = localStorage.getItem("accessToken");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getRoomStatus = (status) => {
    if (status === true) return "Còn trống";
    if (status === false) return "Đã được đặt";
    return "Không rõ";
  };
  const [bookings, setBooking] = useState([]);
  useEffect(() => {
    fetchBookings();
  }, [room.roomId]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      // fetch danh sách hotels
      const res = await fetch(`http://localhost:8080/api/user/public/booking-list/room/${room?.roomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      const data = await res.json();
      console.log("booking by room Id; ", data);

      setBooking(data);
      console.log("booking: ", bookings?.checkinDate);

    } catch (err) {
      console.error(err);
      setError("Tải danh sách khách sạn thất bại.");
    } finally {
      setLoading(false);
    }
  };
  const nextBooking = bookings.length > 0 ? bookings[0] : null;

  return (
    <div className="w-full bg-white rounded-lg cursor-default hover:shadow-md p-4 mb-4">
      <div className="flex flex-col sm:flex-row">
        {/* Hình ảnh */}
        <div className="relative w-full sm:w-60 h-40 rounded overflow-hidden shadow-md">
          <img
            src={`http://localhost:8080${room.roomImageUrls[0]}`}
            alt="Ảnh phòng"
            className="w-full h-full object-cover"
          />

          {/* Overlay + Button */}
          <Link
            to={`/hotels/${room.hotelId}/rooms/${room.roomId}`}
            className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded hover:bg-opacity-80 transition-all duration-200"
          >
            Xem chi tiết
          </Link>
        </div>

        {/* Thông tin phòng */}
        <div className="flex flex-col flex-1 px-4 justify-center">
          <Typography.Title level={5} ellipsis={{ rows: 1 }}>
            {room.roomName}
          </Typography.Title>

          <Typography.Text className="block pb-2">
            Loại phòng: {room.roomType}
          </Typography.Text>

          <Typography.Text className={`font-semibold ${room.roomStatus === "AVAILABLE" ? "text-green-600" : "text-red-500"
            }`}>
            {room.roomStatus === "BOOKED"
              ? `Đã đặt cho đến ngày ${room?.dateAvailable}`
              : nextBooking
                ? `Còn phòng đến ngày ${nextBooking.checkinDate}`
                : `Còn trống (không có booking tương lai)`
            }
          </Typography.Text>

        </div>

        {/* Giá + Đặt phòng */}
        <div className="flex flex-col justify-center items-end mt-4 sm:mt-0">
          <span className="line-through text-gray-400">
            {formatMoney(room.roomPricePerNight)} vnd
          </span>
          <span className="font-bold text-2xl text-red-500">
            {formatMoney(room.roomPricePerNight)} vnd
          </span>

          <Link
            to={`/hotels/${room.hotelId}/rooms/${room.roomId}/booking`}
            className="mt-2"
          >
            <Button
              type="primary"
              disabled={room.roomStatus === "BOOKED"}
            >
              {room.roomStatus === "BOOKED" ? "Đã được đặt" : "Đặt phòng"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

};

export default RoomCardItem;
