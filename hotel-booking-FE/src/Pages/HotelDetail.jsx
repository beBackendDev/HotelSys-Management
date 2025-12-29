import React, { useEffect, useState } from "react";
import { Modal, Tag, Pagination, Typography, DatePicker, Divider, Button, Tooltip } from "antd";
import { formatMoney, formatDate } from "../utils/helper";
import { Link } from "react-router-dom";
import moment from "moment";

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
  const [openRoomModal, setOpenRoomModal] = useState(false);// trạng thái mở modal chi tiết phòng
  const [selectedRoom, setSelectedRoom] = useState(null);// phòng được chọn để xem chi tiết
  const { Title, Text } = Typography;
  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 5,
    totalElements: 0,
  });
  // Thành phần hiển thị thẻ phòng
  const RoomCardItem = ({ room, checkIn, checkOut, onViewDetail }) => {
    const isDateSelected = checkIn && checkOut;
    const isAvailable = room?.roomStatus === "AVAILABLE";

    return (
      <div
        className="border rounded-xl p-4 hover:shadow-lg transition bg-white"
        onClick={() => onViewDetail(room)}
      >
        <div className="flex flex-col md:flex-row gap-4">

          {/* ===== IMAGE ===== */}
          <div
            className="w-full md:w-[220px] h-[150px] rounded-lg overflow-hidden cursor-pointer"

          >
            <img
              src={`http://localhost:8080${room?.roomImageUrls?.[0]}`}
              alt={room?.roomName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* ===== INFO ===== */}
          <div className="flex-1 flex flex-col justify-between">

            <div>
              <Title
                level={5}
                className="mb-1 cursor-pointer"
                onClick={() => onViewDetail(room)}
              >
                {room?.roomName}
              </Title>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <Text>Loại: <b>{room?.roomType}</b></Text>
                <Text>{room?.roomOccupancy} người</Text>

                <Tag color={isAvailable ? "green" : "red"}>
                  {isAvailable ? "Còn trống" : "Đã đặt"}
                </Tag>
              </div>

              <div className="mt-2 text-sm text-gray-500">
                Trống từ ngày: <b>{formatDate(room?.dateAvailable)}</b>
              </div>
            </div>

            {/* ===== PRICE + ACTION ===== */}
            <div className="flex items-end justify-between mt-4">
              <div>
                <div className="text-gray-500 text-sm">Giá / đêm</div>
                <div className="text-lg font-bold text-red-500">
                  {formatMoney(room?.roomPricePerNight)} VND
                </div>
              </div>

              <Button
                type="primary"
                disabled={!isDateSelected || !isAvailable}
                onClick={() => onViewDetail(room)}
              >
                Xem chi tiết
              </Button>
            </div>

            {!isDateSelected && (
              <Text type="danger" className="text-sm mt-2">
                Vui lòng chọn ngày để đặt phòng
              </Text>
            )}
          </div>
        </div>
      </div>
    );
  };

  //hiển thị ảnh
  const images = hotelInfo?.hotelImageUrls || [];
  const extraImages = images?.length - 5;
  const [openGallery, setOpenGallery] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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
  // Fetch hotel và rooms
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
  console.log("owner(hoteldetail): ", owner);


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
  console.log("userinf : ", hotelReviews);

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

          <div className="flex items-center gap-3 text-gray-500">
            <span className="italic">{hotelInfo.hotelAddress}</span>
            {hotelInfo.ratingPoint && (
              <span className="font-medium text-blue-600">
                ⭐ {hotelInfo.ratingPoint} ({hotelInfo.totalReview})
              </span>
            )}
          </div>
        </div>

        {/* ===== IMAGE GALLERY ===== */}
        {/* ===== IMAGE GALLERY ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">

          {/* Ảnh lớn */}
          {images[0] && (
            <img
              src={`http://localhost:8080${images[0]}`}
              onClick={() => {
                setActiveIndex(0);
                setOpenGallery(true);
              }}
              className="cursor-pointer md:col-span-2 h-[320px] w-full object-cover rounded-xl hover:opacity-95 transition"
            />
          )}

          {/* Ảnh nhỏ */}
          <div className="grid grid-cols-2 gap-4">
            {images.slice(1, 5).map((url, i) => {
              const realIndex = i + 1;

              return (
                <div key={i} className="relative">
                  <img
                    src={`http://localhost:8080${url}`}
                    onClick={() => {
                      setActiveIndex(realIndex);
                      setOpenGallery(true);
                    }}
                    className="cursor-pointer h-[150px] w-full object-cover rounded-xl hover:opacity-90 transition"
                  />

                  {/* Overlay +X ảnh */}
                  {i === 3 && extraImages > 0 && (
                    <div
                      onClick={() => {
                        setActiveIndex(realIndex);
                        setOpenGallery(true);
                      }}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl cursor-pointer"
                    >
                      <span className="text-white text-xl font-semibold">
                        +{extraImages} ảnh
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>




        {/* ===== HOTEL DESCRIPTION ===== */}


        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div className="md:col-span-2">
            <Typography.Title level={3}>Về khách sạn</Typography.Title>
            <p className="text-gray-600 leading-relaxed">
              {hotelInfo.hotelDescription}
            </p>
          </div>

          <div className="border rounded-xl p-4 flex items-center gap-4">
            <img
              src={owner?.urlImg || userplaceholder}
              className="w-14 h-14 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{owner?.fullname}</p>
              <p className="text-sm text-gray-500">
                Superhost · {owner?.experienceInHospitality} năm kinh nghiệm
              </p>
            </div>
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
              disabledDate={(current) =>
                current && current < moment().startOf("day")
              }
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
              <span className="text-blue-500">{iconMap[f.icon] || <CheckOutlined />}
              </span>
              <span>{f.name}</span>
            </div>
          ))}
        </div>

        {/* ===== ROOMS ===== */}
        <Typography.Title level={3}>Phòng còn trống</Typography.Title>

        <div className="flex flex-col gap-6 mt-6">
          {loadingRooms ? (
            <div className="flex items-center gap-2 text-gray-500">
              <LoadingOutlined /> Đang kiểm tra phòng trống...
            </div>
          ) : rooms.length ? (
            rooms.map((room) => (
              <RoomCardItem
                room={room}
                checkIn={checkIn}
                checkOut={checkOut}
                onViewDetail={(room) => {
                  setSelectedRoom(room);
                  console.log("room(hoteldetaial): ", room);

                  setOpenRoomModal(true);
                }}
              />

            ))
          ) : (
            <p className="italic text-red-500">
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
                <h3 className="font-semibold">{hotelReviews?.[index]?.fullName}</h3>
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
          {/* <div className="flex justify-center mt-6">
            <Pagination
              current={pagination.pageNo}
              pageSize={pagination.pageSize}
              total={pagination.totalElements}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div> */}
        </div>
        {/* Modal gallery ảnh */}
        <Modal
          visible={openGallery}
          onCancel={() => setOpenGallery(false)}
          footer={null}
          width={1000}
          title={`Hình ảnh khách sạn (${activeIndex + 1}/${images.length})`}
        >

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((url, i) => (
              <img
                key={i}
                src={`http://localhost:8080${url}`}
                className={`w-full h-[200px] object-cover rounded-lg cursor-pointer transition
          ${i === activeIndex ? "ring-4 ring-blue-500" : ""}`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </Modal>
        {/* Modal chi tiết phòng */}
        <Modal
          visible={openRoomModal}
          onCancel={() => setOpenRoomModal(false)}
          footer={null}
          width={900}
          destroyOnClose
        >
          {selectedRoom && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* ===== LEFT: IMAGE GALLERY ===== */}
              <div className="grid grid-cols-2 gap-3">
                <img
                  src={`http://localhost:8080${selectedRoom?.roomImageUrls?.[0]}`}
                  alt="room"
                  className="col-span-2 h-[240px] w-full object-cover rounded-xl"
                />

                {selectedRoom?.roomImageUrls?.slice(1, 5).map((url, index) => (
                  <img
                    key={index}
                    src={`http://localhost:8080${url}`}
                    alt={`room-${index}`}
                    className="h-[110px] w-full object-cover rounded-lg"
                  />
                ))}
              </div>

              {/* ===== RIGHT: INFO ===== */}
              <div className="flex flex-col justify-between">

                <div>
                  <Title level={4} className="mb-1">
                    {selectedRoom?.roomName}
                  </Title>

                  <Text type="secondary">
                    Loại phòng: <b>{selectedRoom?.roomType}</b>
                  </Text>

                  <Divider className="my-3" />

                  {/* ===== Room Meta ===== */}
                  <div className="space-y-2">
                    <Text>
                      Sức chứa: <b>{selectedRoom?.roomOccupancy} người</b>
                    </Text>
                    <br />

                    <Text>
                      Ngày trống gần nhất:{" "}
                      <b>{formatDate(selectedRoom?.dateAvailable)}</b>
                    </Text>
                    <br />

                    <Text>
                      Trạng thái:{" "}
                      <Tag
                        color={
                          selectedRoom?.roomStatus === "AVAILABLE"
                            ? "green"
                            : "red"
                        }
                      >
                        {selectedRoom?.roomStatus === "AVAILABLE"
                          ? "Còn trống"
                          : "Đã được đặt"}
                      </Tag>
                    </Text>
                  </div>

                  <Divider className="my-4" />
                  {/* ===== ROOM FACILITIES ===== */}
                  {selectedRoom?.roomFacilities?.length > 0 && (
                    <>
                      <div>
                        <Text className="font-medium">Tiện ích phòng</Text>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                          {selectedRoom.roomFacilities.map((facility, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-gray-600"
                            >
                              {/* ICON (nếu dùng Ant Icon name) */}
                              <span className="text-blue-500">
                                {iconMap?.[facility?.icon] || <CheckOutlined />}
                              </span>

                              {/* NAME */}
                              <span className="text-sm">{facility.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) || "Phòng không có tiện ích đặc biệt nào."}

                  {/* ===== PRICE ===== */}
                  <div>
                    <Text className="text-gray-500">Giá mỗi đêm</Text>
                    <div className="text-2xl font-bold text-red-500">
                      {formatMoney(selectedRoom?.roomPricePerNight)} VND
                    </div>
                  </div>
                </div>

                {/* ===== ACTION ===== */}
                <div className="mt-6">
                  <Tooltip title="Vui lòng chọn ngày check-in và check-out">
                    <Link
                      to={{
                        pathname: `/hotels/${selectedRoom?.hotelId}/rooms/${selectedRoom?.roomId}/booking`,
                        state: {
                          checkIn: checkIn ? checkIn.format("YYYY-MM-DD") : null,
                          checkOut: checkOut ? checkOut.format("YYYY-MM-DD") : null,
                        }
                      }}
                    >
                      <Button
                        type="primary"
                        block
                        size="large"
                        disabled={!checkIn || !checkOut}
                      >
                        Đặt phòng.
                      </Button>
                    </Link>
                  </Tooltip>


                  {!checkIn && (
                    <Text type="danger" className="block mt-2 text-center">
                      Vui lòng chọn ngày check-in & check-out
                    </Text>
                  )}
                </div>

              </div>
            </div>
          )}
        </Modal>



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
