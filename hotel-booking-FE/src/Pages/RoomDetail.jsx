import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Card,
  Typography,
  Tabs,
  Tag,
  List,
  Divider
} from "antd";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import HomeLayout from "../core/layout/HomeLayout";
import dayjs from "dayjs";

import {
  CarFilled,
  WifiOutlined,
  CoffeeOutlined,
  ShopFilled,
  SunFilled,
  LikeFilled,
  ClockCircleFilled,
  ScheduleFilled,
  CheckOutlined,
  SmileFilled
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const RoomDetail = () => {
  const { hotelid, roomid } = useParams();
  const token = localStorage.getItem("accessToken");

  const [hotel, setHotel] = useState([]);
  const [room, setRoom] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [dates, setDates] = useState([]); 
  const [totalPrice, setTotalPrice] = useState(0);

  // Icon map
  const iconMap = {
    CarFilled: <CarFilled />,
    WifiOutlined: <WifiOutlined />,
    ShopFilled: <ShopFilled />,
    SunFilled: <SunFilled />,
    CoffeeOutlined: <CoffeeOutlined />,
    LikeFilled: <LikeFilled />,
    ClockCircleFilled: <ClockCircleFilled />,
    ScheduleFilled: <ScheduleFilled />,
    CheckOutlined: <CheckOutlined />,
    SmileFilled: <SmileFilled />
  };

  // Fetch room & hotel
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [roomRes, hotelRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/user/public/hotels/${hotelid}/rooms/${roomid}`),
          axios.get(`http://localhost:8080/api/user/public/hotels/${hotelid}`)
        ]);
        setRoom(roomRes.data);
        setHotel(hotelRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [hotelid, roomid]);

  // Fetch bookings for this room
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/user/public/booking-list/room/${roomid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Lỗi lấy booking", err);
      }
    };

    if (roomid) fetchBookings();
  }, [roomid]);

  // Tính giá
  useEffect(() => {
    if (dates.length === 2 && room.roomPricePerNight) {
      const nights = dates[1].diff(dates[0], "day");
      setTotalPrice(nights * room.roomPricePerNight);
    }
  }, [dates, room]);

  if (loading) return <div>Đang tải...</div>;

  return (
    <HomeLayout>
      <div className="mt-[90px] max-w-7xl mx-auto px-4 py-6">

        {/* Tên phòng */}
        <h1 className="text-4xl font-extrabold mb-6">{room.roomName}</h1>

        {/* Khu vực hình ảnh */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {/* Ảnh lớn */}
          {room.roomImageUrls?.[0] && (
            <img
              src={`http://localhost:8080${room.roomImageUrls[0]}`}
              className="col-span-2 h-[380px] w-full object-cover rounded-xl shadow-lg"
            />
          )}

          {/* Ảnh nhỏ */}
          <div className="flex flex-col gap-3">
            {room.roomImageUrls?.slice(1, 4).map((img, i) => (
              <img
                key={i}
                src={`http://localhost:8080${img}`}
                className="h-[120px] w-full rounded-lg object-cover shadow"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">

          {/* ---- CỘT TRÁI ---- */}
          <div className="col-span-2 space-y-6">

            <Card title="Thông tin chi tiết" className="shadow-md rounded-xl">
              <p><b>Giá:</b> {room.roomPricePerNight?.toLocaleString()} VND / đêm</p>
              <p><b>Sức chứa:</b> {room.roomOccupancy} người</p>
              <p><b>Loại phòng:</b> {room.roomType}</p>
            </Card>

            <Card title="Tiện ích phòng" className="shadow-md rounded-xl">
              <div className="grid grid-cols-2 gap-3">
                {hotel?.hotelFacilities?.map((f) => (
                  <div key={f.id} className="flex items-center gap-2">
                    <span style={{ color: "#0db3efff" }}>{iconMap[f.icon]}</span>
                    <Typography.Text>{f.name}</Typography.Text>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* ---- CỘT PHẢI (ĐẶT PHÒNG & BOOKING LIST) ---- */}
          <div className="col-span-1">

            <Card className="shadow-xl rounded-xl p-3 sticky top-[100px]">
              <Tabs defaultActiveKey="1">

                {/* TAB 1: ĐẶT PHÒNG */}
                <TabPane tab="Đặt phòng" key="1">
                  <RangePicker
                    format="DD/MM/YYYY"
                    onChange={(values) => setDates(values)}
                    disabledDate={(cur) => cur && cur < dayjs().startOf("day")}
                    className="w-full mb-4"
                  />

                  {totalPrice > 0 && (
                    <p className="text-lg font-bold text-red-500 mb-4">
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
                      className="w-full"
                      disabled={dates.length !== 2}
                    >
                      Đặt phòng
                    </Button>
                  </Link>
                </TabPane>

                {/* TAB 2: BOOKING SẮP TỚI */}
                <TabPane tab="Lịch phòng" key="2">
                  <List
                    dataSource={bookings}
                    renderItem={(b) => (
                      <List.Item>
                        <div className="flex flex-col">
                          <span><b>Người đặt:</b> {b?.guestName || "Người dùng ẩn danh"}</span>
                          <span>
                            <b>Ngày:</b> {dayjs(b.checkinDate).format("DD/MM")} →{" "}
                            {dayjs(b.checkoutDate).format("DD/MM")}
                          </span>

                          <Tag color="blue" className="mt-1">
                            {b.bookingStatus}
                          </Tag>
                        </div>
                      </List.Item>
                    )}
                    locale={{ emptyText: "Không có booking nào" }}
                  />
                </TabPane>

              </Tabs>
            </Card>

          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default RoomDetail;
