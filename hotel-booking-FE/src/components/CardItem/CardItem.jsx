import { Card, Tooltip } from "antd";
import { EnvironmentOutlined, StarFilled } from "@ant-design/icons";
import placeholder from "../../assets/images/building-placeholder.png";
import { Link } from "react-router-dom";
import { getRoomByHotelId, userGetRoomByHotelId } from "../../slices/room.slice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const CardItem = ({ data }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Đang kiểm tra..."); // trạng thái mặc định
  const id = data?.hotelId;

  const facilitiesArr = data.hotelFacility
    ?.split(",")
    .map((f) => f.trim());

  // Lấy danh sách phòng và xác định trạng thái
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await dispatch(userGetRoomByHotelId({ hotelId: id })).unwrap();
        console.log("Rooms- ", id, ": ", res);

        if (res && res.length > 0) {
          // check nếu có phòng nào AVAILABLE
          const hasAvailableRoom = res.some(
            (room) => room.roomStatus?.toUpperCase() === "AVAILABLE"
          );
          setStatus(hasAvailableRoom ? "Còn phòng" : "Hết phòng");
        } else {
          setStatus("Hết phòng");
        }
      } catch (err) {
        console.error("Error fetching rooms: ", err);
        setStatus("Không xác định");
      }
    };

    if (id) fetchRooms();
  }, [dispatch, id]);

  return (
    <div className="my-2">
      <Card
        className="rounded-xl overflow-hidden relative"
        hoverable
        cover={
          <div className="relative">
            <img
              src={
                data?.hotelImageUrls?.[0]
                  ? `http://localhost:8080${data.hotelImageUrls[0]}`
                  : placeholder
              }
              alt={data?.hotelName || "Hotel Image"}
              className="h-48 w-full object-cover"
            />
            {/* Badge trạng thái phòng */}
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              {status}
            </div>
          </div>
        }
      >
        <div className="flex flex-col">
          <Tooltip placement="bottom" title={data?.hotelName}>
            <span className="font-bold text-lg mt-2 line-clamp-1 overflow-ellipsis">
              {data?.hotelName}
            </span>
          </Tooltip>

          <div className="flex items-center gap-2">
            <EnvironmentOutlined />
            <span className="font-medium text-primary line-clamp-1 overflow-ellipsis">
              {data?.hotelAddress}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <StarFilled style={{ color: "gold" }} />
            <span className="text-[14px] text-primary italic line-clamp-1 overflow-ellipsis">
              {data?.ratingPoint >= 1
                ? [data.ratingPoint ,"  (", data.totalReview, " lượt đánh giá)"]
                : "Chưa có đánh giá nào"}
            </span>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-red-500 font-semibold text-[14px]">
            {data?.hotelAveragePrice
              ? `${data.hotelAveragePrice.toLocaleString()} VNĐ/ đêm`
              : "Liên hệ"}
          </span>
          <Link
            to={`/hotel/${data?.hotelId || "None"}`}
            className="px-3 py-1 border border-blue-500 text-[14px] text-blue-500 rounded-md hover:bg-blue-50 transition"
          >
            Xem chi tiết
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default CardItem;
