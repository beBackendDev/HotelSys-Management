import React, { useEffect, useState } from "react";
import { Pagination, Typography } from "antd";
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
  DingdingOutlined,
  ScheduleFilled,
  SmileFilled
} from "@ant-design/icons";
import { Content } from "antd/lib/layout/layout";
import ratinglayout from "../assets/images/ratinglayout.avif"
import ratinglayout1 from "../assets/images/ratinglayout1.avif"
import userplaceholder from "../assets/images/img-placeholder.jpg"
import { useParams } from "react-router-dom";
import HomeLayout from "../core/layout/HomeLayout";
import RoomCardItem from "../components/RoomCardItem/RoomCardItem";
import Filter from "../components/Filter/Filter";
import Footer from "../components/Footer/Footer";

const HotelDetail = () => {
  const { id } = useParams(); // lấy id từ URL


  const [userInfo, setUserInfo] = useState([]); // thông tin nguoi dung

  const [hotelInfo, setHotelInfo] = useState([]); // thông tin khách sạn
  const [hotelReviews, setHotelReviews] = useState([]); // thông tin danh gia
  const [rooms, setRooms] = useState([]); // danh sách phòng
  const [owner, setOwner] = useState([]); // thoong tin Owner
  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 5,
    totalPage: 1,
    totalElements: 0,
  });
  const token = localStorage.getItem("accessToken");


  const userStr = localStorage.getItem("user");
  const user = JSON.parse(userStr);
  const userId = user?.userId;
  const ownerId = hotelInfo?.ownerId;

  // Map icon name (string) -> component
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
  //fetch Reviews
  const fetchReviews = async (pageNo, pageSize) => {
    try {
      const res = await fetch(`http://localhost:8080/api/user/hotel/${id}/reviews-list?pageNo=${pageNo - 1}&pageSize=${pageSize}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("(HotelDetail)API-Reviews-List:", data);
      setHotelReviews(data?.content || []);
      setPagination((prev) => ({
        ...prev,
        pageNo,
        pageSize,
        totalPage: data.totalPage,
        totalElements: data.totalElements,
      }));

    } catch (err) {
      console.error("Lỗi khi lấy danh sách đánh giá:", err);

    }
  }
  // fetch lần đầu khi component mount
  useEffect(() => {
    // Gọi API lấy danh sách reviews
    fetchReviews(pagination.pageNo, pagination.pageSize);
  }, []);
  const handlePageChange = (page, pageSize) => {
    fetchReviews(page, pageSize);
  };
  useEffect(() => {
    // Goi API lay thong tin nguoi dung da danh gia 
    const fetchUser = async () => {
      if (hotelReviews.length > 0) {
        try {
          const userPromises = hotelReviews.map((review) =>
            fetch(`http://localhost:8080/api/user/profile/${review.userId}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }).then((res) => res.json())
          );

          const users = await Promise.all(userPromises);
          console.log("(HotelDetail)API-AllUsers:", users);
          setUserInfo(users); // Lưu danh sách user
        } catch (error) {
          console.error("Lỗi khi lấy danh sách user:", error);
        }
      }
    }
    // Gọi API khách sạn
    const fetchHotel = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/user/public/hotels/${id}`);
        const data = await res.json();
        console.log("(HotelDetail)API:", data);
        setHotelInfo(data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin khách sạn:", err);
      }
    };

    // Gọi API danh sách phòng
    const fetchRooms = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/user/public/hotels/${id}/rooms`);
        const data = await res.json();
        console.log("(HotelDetail)API-Room:", data);
        setRooms(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách phòng:", err);
      }
    };
    fetchUser();
    fetchHotel();
    fetchRooms();
  }, [id, hotelReviews]);

  //Gọi API lấy thông tin Owner <=> phụ thuộc vào thông tin ownerId trong hotel
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/user/profile/${ownerId}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            }
          }
        );//api lấy thông tin người dùng( owner)
        const data = await res.json();
        console.log("(HotelDetail)API-User:", data);
        setOwner(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người sở hữu.");
      }
    };
    fetchOwner();
  },
    [ownerId]);

  const defaultImage = "../assets/images/image.png";
  const rating = hotelInfo?.ratingPoint >= 1.0 ? hotelInfo?.ratingPoint : "Chưa có đánh giá nào";

  return (
    <HomeLayout>
      <Content className="mt-[100px] flex flex-col max-w-6xl mx-auto py-6">
        {hotelInfo ? (
          <>
            <Typography.Title level={1}>{hotelInfo.hotelName}</Typography.Title>
            {/* Địa chỉ */}
            <Typography.Text className="pb-4 italic">
              {hotelInfo.hotelAddress || "no Address"}
            </Typography.Text>

            {/* Mô tả + Hình ảnh */}
            <div className="flex items-start gap-4">
              <div className="w-1/3">
                <img
                  src={
                    hotelInfo?.hotelImageUrls?.length > 0
                      ? `http://localhost:8080${hotelInfo.hotelImageUrls[0]}`
                      : defaultImage
                  }
                  alt={hotelInfo.hotelName}
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>

              <div className="w-2/3">
                <p className="text-gray-600 text-justify">
                  {hotelInfo.hotelDescription || "no Description"}
                </p>
              </div>
            </div>
            {/* Owner Information */}
            <div className="flex items-center gap-3 pt-2">
              <img
                src={owner?.urlImg || userplaceholder}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-slate-900">
                  Host: {owner?.fullname || "Unknown User"}
                </span>
                <span className="text-sm text-gray-500">
                  Superhost · Với {owner?.experienceInHospitality} năm kinh nghiệm đón tiếp khách
                </span>
              </div>
            </div>

            {/* Tiện ích */}
            <Typography.Title level={2} className="mt-8 border-t-2">
              Danh sách các tiện ích
            </Typography.Title>
            <div className="w-full flex flex-col gap-2 mt-4">
              {hotelInfo?.hotelFacilities?.length > 0 ? (
                hotelInfo.hotelFacilities.map((facility) => (
                  <div key={facility.id} className="flex items-center gap-2"
                    style={{ color: "#0db3efff" }}
                  >
                    {/* Icon (ở đây đang dùng CheckOutlined làm placeholder, 
                        bạn có thể map facility.icon -> fontawesome hoặc ant icon khác) */}
                    {iconMap[facility.icon]}
                    <Typography.Text  style={{ color: "black" }}>
                      {facility.name}
                    </Typography.Text>
                  </div>
                ))
              ) : (
                <Typography.Text>Không có tiện ích nào</Typography.Text>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-row">
            <LoadingOutlined />
            <p className="ml-2">Đang tải thông tin khách sạn.</p>
          </div>
        )}

        {/* Danh sách phòng */}
        <Typography.Title level={2} className="mt-8 border-t-2">
          Danh sách các phòng
        </Typography.Title>
        <div className="flex flex-col gap-6 mt-6">
            {rooms.length > 0 ? (
              rooms.map((room) =><RoomCardItem key={room.id} room={room} />)
            ) : (
              <div className="flex flex-row items-center">
                <LoadingOutlined />
                <p className="ml-2">Không có phòng nào được tìm thấy.</p>
              </div>
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

      </Content>
      <Footer />
    </HomeLayout>
  );
};

export default HotelDetail;
