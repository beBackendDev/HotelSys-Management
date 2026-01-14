import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  EditOutlined,
  ArrowLeftOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MailOutlined,
  DollarOutlined,
  StarOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Card,
  Descriptions,
  Tag,
  Button,
  Divider,
  Image,
  Table,
  Tooltip,
  Space,
  Popconfirm,
  Modal,
} from "antd";
import DashboardLayout from "../../core/layout/Dashboard";
import { toast } from "react-toastify";
import moment from "moment";
import { path } from "../../constant/path";
import { formatMoney } from "../../utils/helper";
import styles from "./hoteldetailadmin.module.scss";
const HotelDetailAdmin = () => {

  const { hotelId } = useParams();
  const [hotel, setHotel] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");
  const decodedToken = JSON.parse(atob(token.split('.')[1])); // decode JWT
  const role = decodedToken.role; // ADMIN, OWNER, USER
  const userId = decodedToken?.userId; // ADMIN, OWNER, USER
  console.log("role: ", decodedToken);

  const images = hotel?.hotelImageUrls || [];
  const extraImages = images?.length - 5;
  const [openGallery, setOpenGallery] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const history = useHistory();
  const getUrlByRole = (role) => {
    switch (role) {
      case "ADMIN":
        return "admin";
      case "OWNER":
        return "owner";
      default:
        return "user"; // USER or guest
    }
  };
  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/dashboard/${getUrlByRole(role)}/${userId}/hotels/${hotelId}/rooms`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch rooms");
      setRooms(await res.json());
    } catch (error) {
      console.error("Fetch rooms error:", error);
    }
  };

  // Fetch hotel info
  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchHotel = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${hotelId}`, {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch hotel");
        const hotelData = await res.json();
        console.log("hotel response: ", hotelData);

        setHotel(hotelData);
        fetchRooms();
      } catch (error) {
        console.error("Fetch hotel error:", error);
      }
    };
    fetchHotel();
  }, [hotelId]);

  const handleCreateRoom = () => {
    history.push(path.createRoom(hotelId))

  }
  // Delete room
  const handleDeleteRoom = async (roomId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${hotelId}/delete-room/${roomId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) throw new Error("Failed to delete room");
      toast.success("Xóa phòng thành công!");
      fetchRooms();
    } catch (error) {
      toast.error("Xóa phòng thất bại!");
    }
  };

  if (!hotel) return <div style={{ padding: 20 }}>Đang tải...</div>;

  const roomColumns = [
    { title: "ID Phòng", dataIndex: "roomId", key: "id" },
    { title: "Tên phòng", dataIndex: "roomName", key: "roomName" },
    { title: "Giá", dataIndex: "roomPricePerNight", key: "price", render: p => `${formatMoney(p)} VND` },
    { title: "Số người", dataIndex: "roomOccupancy", key: "capacity" },
    {
      title: "Trạng thái",
      dataIndex: "roomStatus",
      render: s => (
        <Tag color={s === "AVAILABLE" ? "green" : "volcano"}>
          {s}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_, room) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => history.push(`/dashboard/${getUrlByRole(role)}/hotels/${hotelId}/rooms/${room.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => history.push(`/dashboard/${getUrlByRole(role)}/hotels/${hotelId}/edit-room/${room.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa phòng này?"
            onConfirm={() => handleDeleteRoom(room.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
        {/* Header Section */}
        <div style={{ backgroundColor: "#fff", padding: "24px", marginBottom: "24px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
            <Button
              icon={<ArrowLeftOutlined />}
              type="text"
              size="large"
              onClick={() => history.goBack()}
              style={{ marginBottom: 16 }}
            >
              Quay lại
            </Button>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: "#000" }}>
                  {hotel.hotelName}
                </h1>
              </div>
              <Button
                icon={<EditOutlined />}
                type="primary"
                size="large"
              >
                Chỉnh sửa khách sạn
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px 24px" }}>
          {/* Quick Info Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            {/* Address Card */}
            <Card style={{ textAlign: "center" }} hoverable>
              <EnvironmentOutlined style={{ fontSize: 28, color: "#1890ff", marginBottom: 12, display: "block" }} />
              <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>Địa chỉ</p>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#000" }}>{hotel.hotelAddress}</p>
            </Card>

            {/* Price Card */}
            <Card style={{ textAlign: "center" }} hoverable>
              <DollarOutlined style={{ fontSize: 28, color: "#52c41a", marginBottom: 12, display: "block" }} />
              <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>Giá trung bình</p>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#000" }}>{hotel.hotelAveragePrice} VND</p>
            </Card>

            {/* Rating Card */}
            <Card style={{ textAlign: "center" }} hoverable>
              <StarOutlined style={{ fontSize: 28, color: "#faad14", marginBottom: 12, display: "block" }} />
              <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>Rating</p>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#000" }}>{hotel.ratingPoint} ⭐ ({hotel.totalReview})</p>
            </Card>

            {/* Status Card */}
            <Card style={{ textAlign: "center" }} hoverable>
              <Tag
                color={hotel.hotelStatus === "AVAILABLE" ? "green" : "red"}
                style={{ marginBottom: 12, fontSize: 12, padding: "4px 12px" }}
              >
                {hotel.hotelStatus}
              </Tag>
              <p style={{ margin: 0, fontSize: 12, color: "#666" }}>Trạng thái</p>
            </Card>
          </div>

          {/* Detailed Information */}
          <Card
            title={<span style={{ fontSize: 16, fontWeight: 600 }}>Thông tin chi tiết</span>}
            style={{ marginBottom: 24 }}
          >
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
              <div>
                <div style={{ marginBottom: 24 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>Email liên hệ</p>
                  <p style={{ margin: 0, fontWeight: 600, color: "#000" }}>
                    <MailOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                    {hotel.hotelContactMail}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>Số điện thoại</p>
                  <p style={{ margin: 0, fontWeight: 600, color: "#000" }}>
                    <PhoneOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                    {hotel.hotelContactPhone}
                  </p>
                </div>
              </div>
              <div>
                <div style={{ marginBottom: 24 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>Ngày tạo</p>
                  <p style={{ margin: 0, fontWeight: 600, color: "#000" }}>
                    {moment(hotel.hotelCreatedAt).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 12, color: "#666", marginBottom: 8 }}>Ngày cập nhật</p>
                  <p style={{ margin: 0, fontWeight: 600, color: "#000" }}>
                    {moment(hotel.hotelUpdatedAt).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Hotel Images */}
          <div
            className={`${styles['gallery-grid']} mb-12`}
          >
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

          {/* Facilities */}
          <Card
            title={<span style={{ fontSize: 16, fontWeight: 600 }}>Tiện ích khách sạn</span>}
            style={{ marginBottom: 24 }}
          >
            {hotel.hotelFacilities?.length > 0 ? (
              <Space wrap size={[8, 8]}>
                {hotel.hotelFacilities.map((f, i) => (
                  <Tag key={i} color="blue" style={{ padding: "4px 12px" }}>
                    {f.name}
                  </Tag>
                ))}
              </Space>
            ) : (
              <p style={{ color: "#999" }}>Chưa có tiện ích</p>
            )}
          </Card>

          {/* Rooms List */}
          <Card
            title={<span style={{ fontSize: 16, fontWeight: 600 }}>Danh sách phòng</span>}
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateRoom}
              >
                Thêm phòng
              </Button>
            }
          >
            <Table
              columns={roomColumns}
              dataSource={rooms}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        </div>
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
    </DashboardLayout>
  );
};

export default HotelDetailAdmin;
