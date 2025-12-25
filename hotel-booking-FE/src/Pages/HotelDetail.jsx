import React, { useEffect, useState } from "react";
import { Pagination, Typography, DatePicker, Divider, Button } from "antd";
import {
  CheckOutlined,
  LoadingOutlined,
  CarFilled,
  WifiOutlined,
  CoffeeOutlined,
  ShopFilled,
  SunFilled,
  LikeFilled,
  ClockCircleFilled,
  ScheduleFilled,
  SmileFilled,
} from "@ant-design/icons";
import { Content } from "antd/lib/layout/layout";
import { useParams } from "react-router-dom";
import ratinglayout from "../assets/images/ratinglayout.avif"
import ratinglayout1 from "../assets/images/ratinglayout1.avif"

import HomeLayout from "../core/layout/HomeLayout";
import RoomCardItem from "../components/RoomCardItem/RoomCardItem";
import Footer from "../components/Footer/Footer";

import userplaceholder from "../assets/images/img-placeholder.jpg";

const HotelDetail = () => {
  const { id } = useParams();

  const [hotelInfo, setHotelInfo] = useState(null);
  const [hotelReviews, setHotelReviews] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [owner, setOwner] = useState(null);
  const [userInfo, setUserInfo] = useState([]);

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);// ngày check-in và check-out được chọn
  const [loadingRooms, setLoadingRooms] = useState(false); // trạng thái tải phòng
  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 5,
    totalElements: 0,
  });

  const token = localStorage.getItem("accessToken");
  const ownerId = hotelInfo?.ownerId;
  // Kiểm tra phòng trống
  const handleCheckAvailability = async () => {
    if (!checkIn || !checkOut) return;

    setLoadingRooms(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/user/public/room-available?checkIn=${checkIn.format("YYYY-MM-DD")}&checkOut=${checkOut.format("YYYY-MM-DD")}`
      );

      const data = await res.json();
      setRooms(data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRooms(false);
    }
  };

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
    SmileFilled: <SmileFilled />,
  };

  /* ================= FETCH ================= */

  const fetchReviews = async (pageNo, pageSize) => {
    const res = await fetch(
      `http://localhost:8080/api/user/hotel/${id}/reviews-list?pageNo=${pageNo - 1}&pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const data = await res.json();
    setHotelReviews(data?.content || []);
    setPagination({ pageNo, pageSize, totalElements: data.totalElements });
  };

  useEffect(() => {
    fetchReviews(pagination.pageNo, pagination.pageSize);
  }, []);
  const handlePageChange = (page, pageSize) => {
    fetchReviews(page, pageSize);
  };
  useEffect(() => {
    fetch(`http://localhost:8080/api/user/public/hotels/${id}`)
      .then((r) => r.json())
      .then(setHotelInfo);

    fetch(`http://localhost:8080/api/user/public/hotels/${id}/rooms`)
      .then((r) => r.json())
      .then(setRooms);
  }, [id]);
  console.log("hotel api (hoteldetail)", hotelInfo);
  console.log("room api (hoteldetail)", rooms);
  useEffect(() => {
    if (!ownerId) return;
    fetch(`http://localhost:8080/api/user/profile/${ownerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setOwner);
  }, [ownerId]);

  useEffect(() => {
    if (!hotelReviews.length) return;
    Promise.all(
      hotelReviews.map((r) =>
        fetch(`http://localhost:8080/api/user/profile/${r.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => res.json())
      )
    ).then(setUserInfo);
  }, [hotelReviews]);

  if (!hotelInfo) {
    return (
      <HomeLayout>
        <Content className="mt-[120px] flex justify-center">
          <LoadingOutlined /> <span className="ml-2">Đang tải...</span>
        </Content>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout>
      <Content className="mt-[100px] max-w-7xl mx-auto px-4 pb-12">

        {/* ===== HEADER ===== */}
        <div className="mb-6">
          <Typography.Title level={1} className="mb-1">
            {hotelInfo.hotelName}
          </Typography.Title>
          <p className="text-gray-500 italic">
            {hotelInfo.hotelAddress}
          </p>
        </div>
        {/* ===== OWNER ===== */}
        <div className="flex items-center gap-4 p-4 border rounded-xl mb-10">
          <img
            src={owner?.urlImg || userplaceholder}
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">
              Chủ nhà: {owner?.fullname}
            </p>
            <p className="text-sm text-gray-500">
              Superhost · {owner?.experienceInHospitality} năm kinh nghiệm
            </p>
          </div>
        </div>
        {/* ===== DATE PICKER (BOOKING BAR) ===== */}
        <div className="sticky top-[80px] z-20 bg-white shadow-sm border rounded-xl p-4 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 border rounded-xl bg-gray-50">
            <div>
              <p className="font-medium">Chọn ngày để xem giá & đặt phòng</p>
              <p className="text-sm text-gray-500">
                Giá phòng thay đổi theo ngày
              </p>
            </div>

            <DatePicker.RangePicker
              className="w-full md:w-[320px]"
              onChange={(dates) => {
                setCheckIn(dates?.[0]);
                setCheckOut(dates?.[1]);
              }}
            />

            <Button
              type="primary"
              danger={!checkIn || !checkOut}
              disabled={!checkIn || !checkOut}
              loading={loadingRooms}
              onClick={handleCheckAvailability}
            >
              {!checkIn || !checkOut ? "Chọn ngày trước" : "Kiểm tra giá"}
            </Button>
          </div>

        </div>



        {/* ===== FACILITIES ===== */}
        <Typography.Title level={2}>Tiện ích</Typography.Title>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 mb-12">
          {hotelInfo.hotelFacilities?.map((f) => (
            <div key={f.id} className="flex items-center gap-2 text-gray-700">
              <span className="text-blue-500">{iconMap[f.icon]}</span>
              <span>{f.name}</span>
            </div>
          ))}
        </div>

        {/* ===== ROOMS ===== */}
        <Typography.Title level={2} className="mt-8">
          Danh sách phòng
        </Typography.Title>

        <div className="flex flex-col gap-6 mt-6">
          {loadingRooms ? (
            <div className="flex items-center gap-2 text-gray-500">
              <LoadingOutlined /> Đang kiểm tra phòng trống...
            </div>
          ) : rooms.length ? (
            rooms.map((room) => (
              <RoomCardItem
                key={room.roomId}
                room={room}
                checkIn={checkIn}
                checkOut={checkOut}
              />
            ))
          ) : (
            <p className="text-red-500 italic">
              Không có phòng trống trong khoảng ngày đã chọn
            </p>
          )}
        </div>


     {/* Đánh giá */}
        <div className="mt-4 flex flex-col items-center justify-center p-10">
          <span className="flex flex-row font-bold text-8xl justify-items-center">
            <img src={ratinglayout1} className="w-[70px]" srcset="" />
            {hotelInfo?.ratingPoint || "Chưa có đánh giá nào"}
            <img src={ratinglayout} className="w-[70px]" srcset="" />
          </span>
          <span className="max-w-[300px] text-center">Được đánh giá chính xác dựa trên trải nghiệm người dùng</span>
        </div>
        <div className="divide-y">
          {hotelReviews.map((review, index) => (
            <div key={index} className="flex space-x-4 p-4 border-t border-b">
              {/* Avatar */}
              <img
                src={userInfo?.[index]?.urlImg || userplaceholder}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />

              {/* Nội dung */}
              <div>
                {/* Tên + mô tả */}
                <h3 className="font-semibold">{userInfo?.[index]?.fullname}</h3>
                <p className="text-sm text-gray-500">Thành viên đã tham gia từ lâu</p>

                {/* Rating + thời gian */}
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                  <span className="text-black">
                    {"★".repeat(review?.ratingPoint)}{"☆".repeat(5 - review.ratingPoint)}
                  </span>
                  <span>{new Date(review?.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>

                {/* Review text */}
                <p className="mt-2 text-gray-800">{review.comment}</p>
              </div>
            </div>
          ))}
          <div className="flex justify-center mt-6">
            <Pagination
              current={pagination.pageNo}
              pageSize={pagination.pageSize}
              total={pagination.totalElements}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>

        <Pagination
          className="mt-6 flex justify-center"
          current={pagination.pageNo}
          pageSize={pagination.pageSize}
          total={pagination.totalElements}
          onChange={(p, s) => fetchReviews(p, s)}
        />
      </Content>

      <Footer />
    </HomeLayout>
  );
};

export default HotelDetail;
