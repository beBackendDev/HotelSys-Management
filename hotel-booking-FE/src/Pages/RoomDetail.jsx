import React, { useEffect, useState } from "react";
import { Button, DatePicker, Card } from "antd";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import HomeLayout from "../core/layout/HomeLayout";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const RoomDetail = () => {
  const { hotelid, roomid } = useParams(); // Lấy param
  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState([]); // lưu ngày check-in, check-out
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/user/public/hotels/${hotelid}/rooms/${roomid}`
        );
        setRoom(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu phòng:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetail();

    const fetchHotelDetail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/user/public/hotels/${hotelid}`
        );
        setHotel(res.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu khách sạn:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetail();
  }, [hotelid, roomid]);

  // Tính tổng tiền khi chọn ngày
  useEffect(() => {
    if (dates.length === 2 && room) {
      const nights = dates[1].diff(dates[0], "day");
      const total = nights * room.roomPricePerNight;
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [dates, room]);

  if (loading) return <div className="p-4">Đang tải...</div>;
  if (!room) return <div className="p-4 text-red-500">Không tìm thấy phòng</div>;

  return (
    <HomeLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Title + hình ảnh */}
        <h1 className="text-3xl font-bold mb-4">{room.roomName}</h1>
        {room.roomImageUrls?.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {room.roomImageUrls.map((url, index) => (
              <img
                key={index}
                src={`http://localhost:8080${url}`}
                alt={`Ảnh phòng ${index + 1}`}
                className="h-48 w-full object-cover rounded shadow"
              />
            ))}
          </div>
        )}

        {/* Layout chia 2 cột */}
        <div className="grid grid-cols-3 gap-6">
          {/* Cột trái: thông tin tiện ích */}
          <div className="col-span-2 space-y-4">
            <Card title="Thông tin chi tiết" bordered={false}>
              <p>
                <span className="font-semibold">Giá:</span>{" "}
                {room.roomPricePerNight.toLocaleString()} VND / đêm
              </p>
              <p>
                <span className="font-semibold">Sức chứa:</span>{" "}
                {room.roomOccupancy} người
              </p>
              <p>
                <span className="font-semibold">Loại phòng:</span> {room.roomType}
              </p>
            </Card>

            <Card title="Tiện ích phòng" bordered={false}>
              <ul className="list-disc pl-6 space-y-1">
                {hotel.hotelFacility ? (
                  <li>{hotel.hotelFacility}</li>
                ) : (
                  <li>Chưa có thông tin tiện ích</li>
                )}
              </ul>
            </Card>
          </div>

          {/* Cột phải: Date picker + giá tiền + nút đặt phòng */}
          <div className="col-span-1">
            <div className="sticky top-20">
              <Card title="Đặt phòng" bordered={true}>
                <RangePicker
                  format="DD/MM/YYYY"
                  onChange={(values) => setDates(values)}
                  disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  className="w-full mb-4"
                />

                {totalPrice > 0 && (
                  <p className="mb-4 text-lg font-bold text-red-600">
                    Tổng tiền: {totalPrice.toLocaleString()} VND
                  </p>
                )}

                <Link
                  to={`/hotels/${room.hotelId}/rooms/${room.roomId}/booking`}
                  state={{ checkIn: dates[0], checkOut: dates[1], totalPrice }}
                >
                  <Button
                    type="primary"
                    size="large"
                    disabled={dates.length !== 2}
                    className="w-full"
                  >
                    Đặt phòng
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default RoomDetail;
