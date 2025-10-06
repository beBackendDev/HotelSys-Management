import { Button, Tag, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { typeOfRoom } from "../../constant/common";
import { formatMoney } from "../../utils/helper";
const getRoomStatus = (status) => {
  if (status === true) return "Còn trống";
  if (status === false) return "Đã được đặt";
  return "Không rõ";
};
const RoomCardItem = ({ room }) => {
  console.log("(roomItem)" + room.roomImageUrls?.[0]);

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

        <Typography.Text
          className={`font-semibold ${
            room.roomStatus === "AVAILABLE" ? "text-green-600" : "text-red-500"
          }`}
        >
          {room.roomStatus === "AVAILABLE" ? "Còn phòng" : "Đã đặt"}
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
            disabled={room.roomStatus !== "AVAILABLE"}
          >
            Đặt phòng
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

};

export default RoomCardItem;
