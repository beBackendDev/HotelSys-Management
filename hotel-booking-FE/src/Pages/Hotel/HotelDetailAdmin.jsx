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
} from "antd";
import DashboardLayout from "../../core/layout/Dashboard";
import { toast } from "react-toastify";
import moment from "moment";
import { path } from "../../constant/path";
import { formatMoney } from "../../utils/helper";

const HotelDetailAdmin = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("accessToken");
  const decodedToken = JSON.parse(atob(token.split('.')[1])); // decode JWT
  const role = decodedToken.role; // ADMIN, OWNER, USER
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
      const res = await fetch(`http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${hotelId}/rooms`, {
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
        `http://localhost:8080/api/dashboard/admin/hotels/${hotelId}/delete-room/${roomId}`,
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
              onClick={() => history.push(`/dashboard/admin/hotels/${hotelId}/rooms/${room.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              icon={<EditOutlined />}
              onClick={() => history.push(`/dashboard/admin/hotels/${hotelId}/edit-room/${room.id}`)}
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
      <div className="p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => history.goBack()}
          style={{ marginBottom: 20 }}
        >
          Quay lại
        </Button>

        {/* Thông tin khách sạn */}
        <Card
          title={
            <span style={{ fontSize: 22 }}>{hotel.hotelName}</span>
          }
          extra={<Button icon={<EditOutlined />}>Chỉnh sửa khách sạn</Button>}
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Địa chỉ">
              <EnvironmentOutlined /> {hotel.hotelAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Giá trung bình">
              <DollarOutlined /> {hotel.hotelAveragePrice} VND
            </Descriptions.Item>
            <Descriptions.Item label="Email liên hệ">
              <MailOutlined /> {hotel.hotelContactMail}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              <PhoneOutlined /> {hotel.hotelContactPhone}
            </Descriptions.Item>
            <Descriptions.Item label="Rating">
              <StarOutlined /> {hotel.ratingPoint || 0} ⭐ ({hotel.totalReview} đánh giá)
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={hotel.hotelStatus === "AVAILABLE" ? "green" : "red"}>
                {hotel.hotelStatus}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {moment(hotel.hotelCreatedAt).format("DD/MM/YYYY")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật">
              {moment(hotel.hotelUpdatedAt).format("DD/MM/YYYY")}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Divider />

        {/* Hình ảnh khách sạn */}
        <Card title="Hình ảnh khách sạn">
          <Image.PreviewGroup>
            {hotel.hotelImageUrls?.map((img, i) => (
              <Image
                key={i}
                width={200}
                src={img}
                style={{ marginRight: 10, borderRadius: 10 }}
              />
            ))}
          </Image.PreviewGroup>
        </Card>

        <Divider />

        {/* Tiện ích khách sạn */}
        <Card title="Tiện ích khách sạn">
          {hotel.hotelFacilities?.map((f, i) => (
            <Tag key={i} color="blue">{f.name}</Tag>
          ))}
        </Card>

        <Divider />

        {/* Danh sách phòng */}
        <Card
          title="Danh sách phòng"
          extra={
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRoom}>
              Thêm phòng
            </Button>
          }
        >
          <Table
            columns={roomColumns}
            dataSource={rooms}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HotelDetailAdmin;
