import React, { useEffect, useState } from "react";
import { Modal, Tag, Pagination, Typography, DatePicker, Divider, Button, Tooltip } from "antd";
import { formatMoney, formatDate } from "../../utils/helper";
import styles from "./styles.module.scss";
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
import ratinglayout from "../../assets/images/ratinglayout.avif"
import ratinglayout1 from "../../assets/images/ratinglayout1.avif"

import HomeLayout from "../../core/layout/HomeLayout";
import RoomCardItem from "../../components/RoomCardItem/RoomCardItem";
import Footer from "../../components/Footer/Footer";

import userplaceholder from "../../assets/images/img-placeholder.jpg";

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
  const [openRoomGallery, setOpenRoomGallery] = useState(false);
  const [roomActiveIndex, setRoomActiveIndex] = useState(0);

  const { Title, Text } = Typography;
  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 5,
    totalElements: 0,
  });
  // Thành phần hiển thị thẻ phòng
  const RoomCardItem = ({ room, checkIn, checkOut, onViewDetail }) => {
    const isDateSelected = checkIn && checkOut;
    // const isAvailable = room?.roomStatus === "AVAILABLE";

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

                {/* <Tag color={isAvailable ? "green" : "red"}>
                  {isAvailable ? "Còn trống" : "Đã đặt"}
                </Tag> */}
              </div>

              {/* <div className="mt-2 text-sm text-gray-500">
                Trống từ ngày: <b>{formatDate(room?.dateAvailable)}</b>
              </div> */}
            </div>

            {/* ===== PRICE + ACTION ===== */}
            <div className="flex items-end justify-between mt-4">
              <div>
                <div className="text-gray-500 text-sm">Giá / đêm</div>
                <div className="text-lg font-bold text-red-500">
                  {formatMoney(room?.roomPricePerNight)} VND
                </div>
              </div>

              {/* <Button
                type="primary"
                // disabled={!isDateSelected || !isAvailable}
                disabled={!isDateSelected}
                onClick={() => onViewDetail(room)}
              >
                Xem chi tiết
              </Button> */}
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
  const roomImages = selectedRoom?.roomImageUrls || [];
const roomExtraImages = roomImages.length - 5;

  const [openGallery, setOpenGallery] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const token = localStorage.getItem("accessToken");
  const ownerId = hotelInfo?.ownerId;
  // Kiểm tra phòng trống
  const handleCheckAvailability = async () => {
    const hotelId = hotelInfo?.hotelId;
    if (!hotelId || !checkIn || !checkOut) return;

    setLoadingRooms(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/user/public/room-available?hotelId=${hotelId}&checkIn=${checkIn.format("YYYY-MM-DD")}&checkOut=${checkOut.format("YYYY-MM-DD")}`
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
    try {
      const res = await fetch(
        `http://localhost:8080/api/user/public/hotel/${id}/reviews-list?pageNo=${pageNo - 1}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await res.json();

      setHotelReviews(data?.content ?? []);
      setPagination({
        pageNo,
        pageSize,
        totalElements: data?.totalElements ?? 0,
      });
    } catch (error) {
      console.error("Fetch reviews error:", error);
      setHotelReviews([]);
      setPagination({
        pageNo,
        pageSize,
        totalElements: 0,
      });
    }
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

  // Fetch owner info
  useEffect(() => {
    const fetchOwner = async () => {
      if (!ownerId) return;

      try {
        const res = await fetch(
          `http://localhost:8080/api/user/public/profile/${ownerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch owner");
        }

        const data = await res.json();
        setOwner(data ?? null);
      } catch (error) {
        console.error("Fetch owner error:", error);
        setOwner(null); // fallback tránh crash UI
      }
    };

    fetchOwner();
  }, [ownerId]);

  console.log("owner(hoteldetail): ", owner);


  useEffect(() => {
    const fetchUsers = async () => {
      if (!hotelReviews?.length) {
        setUserInfo([]);
        return;
      }

      try {
        const users = await Promise.all(
          hotelReviews.map(async (r) => {
            try {
              const res = await fetch(
                `http://localhost:8080/api/user/profile/${r.userId}`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );

              if (!res.ok) throw new Error("Failed to fetch user");

              return await res.json();
            } catch (err) {
              console.error(`Fetch user ${r.userId} error:`, err);
              return null;
            }
          })
        );

        setUserInfo(users.filter(Boolean)); // bỏ user null
      } catch (error) {
        console.error("Fetch users error:", error);
        setUserInfo([]);
      }
    };

    fetchUsers();
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
        <div className={`${styles['header-section']} mb-8 animate-fade-in`}>
          <Typography.Title level={1} className="mb-2 text-gray-900">
            {hotelInfo.hotelName}
          </Typography.Title>

          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <span className="flex items-center gap-2 text-base">
              <span className="text-blue-500">📍</span>
              <span className="italic">{hotelInfo.hotelAddress}</span>
            </span>

            {hotelInfo.ratingPoint && (
              <span className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full font-semibold text-blue-700">
                ⭐ {hotelInfo.ratingPoint}
                <span className="text-gray-500 font-normal">
                  ({hotelInfo.totalReview} đánh giá)
                </span>
              </span>
            )}
          </div>
        </div>

        {/* ===== IMAGE GALLERY ===== */}
        <div className={`${styles['gallery-grid']} mb-12`}>
          {images[0] && (
            <div className={styles['gallery-main']}>
              <img
                src={`http://localhost:8080${images[0]}`}
                alt="Main hotel view"
                onClick={() => {
                  setActiveIndex(0);
                  setOpenGallery(true);
                }}
                className={styles['gallery-image']}
              />
            </div>
          )}

          <div className={styles['gallery-thumbnails']}>
            {images.slice(1, 5).map((url, i) => {
              const realIndex = i + 1;
              return (
                <div key={i} className={styles['gallery-thumbnail-wrapper']}>
                  <img
                    src={`http://localhost:8080${url}`}
                    alt={`Hotel view ${realIndex}`}
                    onClick={() => {
                      setActiveIndex(realIndex);
                      setOpenGallery(true);
                    }}
                    className={styles['gallery-image']}
                  />

                  {i === 3 && extraImages > 0 && (
                    <div
                      onClick={() => {
                        setActiveIndex(realIndex);
                        setOpenGallery(true);
                      }}
                      className={styles['gallery-overlay']}
                    >
                      <span className="text-white text-xl font-bold">
                        +{extraImages} ảnh
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== DESCRIPTION & OWNER ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className={`lg:col-span-2 ${styles['description-section']}`}>
            <Typography.Title level={3} className="mb-4">
              Về khách sạn
            </Typography.Title>
            <p className="text-gray-700 leading-relaxed text-base">
              {hotelInfo.hotelDescription}
            </p>
          </div>

          <div className={styles['owner-card']}>
            <div className="flex items-center gap-4">
              <img
                src={`http://localhost:8080${owner?.urlImg}` || userplaceholder}
                alt="Owner"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
              />
              <div>
                <p className="font-semibold text-lg text-gray-900">
                  {owner?.fullname}
                </p>
                <p className="text-sm text-gray-500">
                  🏆 Superhost · {owner?.experienceInHospitality} năm kinh nghiệm
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== BOOKING BAR ===== */}
        <div className={styles['booking-bar-sticky']}>
          <div className={styles['booking-bar-content']}>
            <div>
              <p className="font-semibold text-lg text-gray-900">
                Chọn ngày để xem giá & đặt phòng
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Giá phòng thay đổi theo ngày
              </p>
            </div>

            <DatePicker.RangePicker
              className={styles['booking-datepicker']}
              size="large"
              format="DD/MM/YYYY"
              placeholder={['Ngày đến', 'Ngày đi']}
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
              size="large"
              disabled={!checkIn || !checkOut}
              loading={loadingRooms}
              onClick={handleCheckAvailability}
              className={styles['booking-button']}
            >
              {!checkIn || !checkOut ? "Chọn ngày trước" : "🔍 Kiểm tra giá"}
            </Button>
          </div>
        </div>

        {/* ===== FACILITIES ===== */}
        <div className={`${styles['facilities-section']} mb-12`}>
          <Typography.Title level={3} className="mb-6">
            ✨ Tiện ích khách sạn
          </Typography.Title>

          <div className={styles['facilities-grid']}>
            {hotelInfo.hotelFacilities?.map((f) => (
              <div key={f.id} className={styles['facility-item']}>
                <span className={styles['facility-icon']}>
                  {iconMap[f.icon] || <CheckOutlined />}
                </span>
                <span className={styles['facility-name']}>{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== ROOMS ===== */}
        <div className={`${styles['rooms-section']} mb-12`}>
          <Typography.Title level={3} className="mb-6">
            🏨 Danh sách phòng
          </Typography.Title>

          <div className={styles['rooms-list']}>
            {loadingRooms ? (
              <div className={styles['loading-state']}>
                <LoadingOutlined className="text-2xl" />
                <span className="ml-3">Đang kiểm tra phòng trống...</span>
              </div>
            ) : rooms.length ? (
              rooms.map((room) => (
                <RoomCardItem
                  key={room.roomId}
                  hotelId={hotelInfo?.hotelId}
                  room={room}
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onViewDetail={(room) => {
                    setSelectedRoom(room);
                    setOpenRoomModal(true);
                  }}
                />
              ))
            ) : (
              <div className={styles['empty-state']}>
                <p className="text-lg text-red-500">
                  ⚠️ Không có phòng trống
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===== REVIEWS ===== */}
        <div className={`${styles['reviews-section']} mb-12`}>
          <div className={styles['rating-header']}>
            <div className={styles['rating-display']}>
              <img src={ratinglayout1} className={styles['rating-icon']} alt="" />
              <span className={styles['rating-score']}>
                {hotelInfo?.ratingPoint || "N/A"}
              </span>
              <img src={ratinglayout} className={styles['rating-icon']} alt="" />
            </div>
            <p className={styles['rating-subtitle']}>
              Đánh giá từ trải nghiệm thực tế
            </p>
          </div>

          <div className={styles['reviews-list']}>
            {hotelReviews.map((review, index) => (
              <div key={index} className={styles['review-card']}>
                <img
                  src={review?.urlImg || userplaceholder}
                  alt=""
                  className={styles['review-avatar']}
                />
                <div className={styles['review-content']}>
                  <h4 className={styles['review-author']}>
                    {review.fullName}
                  </h4>
                  <div className={styles['review-rating-date']}>
                    <span className={styles['review-stars']}>
                      {"★".repeat(review.ratingPoint)}
                      {"☆".repeat(5 - review.ratingPoint)}
                    </span>
                    <span className={styles['review-date']}>
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className={styles['review-text']}>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            className={styles['pagination-center']}
            current={pagination.pageNo}
            pageSize={pagination.pageSize}
            total={pagination.totalElements}
            onChange={(p, s) => fetchReviews(p, s)}
            showSizeChanger={false}
          />
        </div>
        {/* ===== GALLERY HOTEL MODAL ===== */}
        <Modal
          visible={openGallery}
          onCancel={() => setOpenGallery(false)}
          footer={null}
          width={1200}
          title={`Hình ảnh khách sạn (${activeIndex + 1}/${images.length})`}
          className={styles['gallery-modal']}
        >
          <div className={styles['modal-gallery-grid']}>
            {images.map((url, i) => (
              <img
                key={i}
                src={`http://localhost:8080${url}`}
                alt={`Gallery ${i + 1}`}
                className={`${styles['modal-gallery-image']} ${i === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        </Modal>
        {/* ===== GALLERY ROOM MODAL ===== */}
        <Modal
          visible={openRoomGallery}
          onCancel={() => setOpenRoomGallery(false)}
          footer={null}
          width={1200}
          title={`Hình ảnh phòng (${roomActiveIndex + 1}/${selectedRoom?.roomImageUrls?.length})`}
          className={styles['gallery-modal']}
        >
          <div className={styles['modal-gallery-grid']}>
            {selectedRoom?.roomImageUrls?.map((url, i) => (
              <img
                key={i}
                src={`http://localhost:8080${url}`}
                alt={`Room gallery ${i + 1}`}
                className={`${styles['modal-gallery-image']} ${i === roomActiveIndex ? styles.active : ""
                  }`}
                onClick={() => setRoomActiveIndex(i)}
              />
            ))}
          </div>
        </Modal>

        {/* ===== ROOM DETAIL MODAL ===== */}
        <Modal
          visible={openRoomModal}
          onCancel={() => setOpenRoomModal(false)}
          footer={null}
          width={1000}
          destroyOnClose
          className={styles['room-modal']}
        >
          {selectedRoom && (
            <div className={styles['room-modal-content']}>
              {/* LEFT: Images */}
              <div className={styles['room-modal-gallery']}>
                <img
                  src={`http://localhost:8080${selectedRoom?.roomImageUrls?.[0]}`}
                  alt="Main room view"
                  className={styles['room-modal-main-image']}
                  onClick={() => {
                    setRoomActiveIndex(0);
                    setOpenRoomGallery(true);
                  }}
                />

                <div className={styles['room-modal-thumbnails']}>
  {roomImages.slice(1, 5).map((url, index) => {
    const realIndex = index + 1;

    return (
      <div
        key={index}
        className={styles['room-thumbnail-wrapper']}
      >
        <img
          src={`http://localhost:8080${url}`}
          alt={`Room view ${realIndex}`}
          className={styles['room-modal-thumbnail']}
          onClick={() => {
            setRoomActiveIndex(realIndex);
            setOpenRoomGallery(true);
          }}
        />

        {/* OVERLAY +X ẢNH */}
        {index === 3 && roomExtraImages > 0 && (
          <div
            className={styles['room-gallery-overlay']}
            onClick={() => {
              setRoomActiveIndex(realIndex);
              setOpenRoomGallery(true);
            }}
          >
            <span>+{roomExtraImages} ảnh</span>
          </div>
        )}
      </div>
    );
  })}
</div>

              </div>

              {/* RIGHT: Info */}
              <div className="room-modal-info">
                <div>
                  <Title level={4} className="mb-2">
                    {selectedRoom?.roomName}
                  </Title>
                  <Text type="secondary" className="text-base">
                    Loại phòng: <strong>{selectedRoom?.roomType}</strong>
                  </Text>

                  <Divider className="my-4" />

                  <div className="room-meta">
                    <Text className="block mb-2">
                      👥 Sức chứa: <strong>{selectedRoom?.roomOccupancy} người</strong>
                    </Text>
                  </div>

                  <Divider className="my-4" />

                  {/* Facilities */}
                  {selectedRoom?.roomFacilities?.length > 0 && (
                    <div className={styles['room-facilities']}>
                      <Text className="font-semibold text-base block mb-3">
                        ✨ Tiện ích phòng
                      </Text>
                      <div className={styles['room-facilities-grid']}>
                        {selectedRoom.roomFacilities.map((facility, index) => (
                          <div key={index} className={styles['room-facility-item']}>
                            <span className={styles['facility-icon-small']}>
                              {iconMap?.[facility?.icon] || <CheckOutlined />}
                            </span>
                            <span className="text-sm">{facility.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Divider className="my-4" />

                  {/* Price */}
                  <div className={styles['room-price']}>
                    <Text className="text-gray-500">Giá mỗi đêm</Text>
                    <div className={styles['price-value']}>
                      {formatMoney(selectedRoom?.roomPricePerNight)} VND
                    </div>
                  </div>
                </div>

                {/* Booking Button */}
                <div className={styles['room-modal-actions']}>
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
                        className={`${styles['booking-modal-button']}`}
                      >
                        🏨 Đặt phòng ngay
                      </Button>
                    </Link>
                  </Tooltip>

                  {!checkIn && (
                    <Text type="danger" className="block mt-3 text-center">
                      ⚠️ Vui lòng chọn ngày check-in & check-out
                    </Text>
                  )}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </Content>
      <Footer />
    </HomeLayout>
  );

};

export default HotelDetail;
