import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
    EditOutlined,
    ArrowLeftOutlined,
    DollarOutlined,
    TeamOutlined,
    ApartmentOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import {
    Card,
    Descriptions,
    Tag,
    Button,
    Divider,
    Image,
    Typography,
} from "antd";
import DashboardLayout from "../../core/layout/Dashboard";
import moment from "moment";

const { Title } = Typography;

const RoomDetailAdmin = () => {
    const { hotelId, roomId } = useParams();
    const history = useHistory();
    const [room, setRoom] = useState([]);
    const [hotel, setHotel] = useState([]);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/dashboard/admin/hotels/${hotelId}/rooms/${roomId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch room");
                const data = await res.json();
                setRoom(data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };

        const fetchHotel = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/dashboard/admin/hotels/${hotelId}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch room");
                const data = await res.json();
                setHotel(data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchRoom();
        fetchHotel();
    }, [hotelId, roomId, token]);

    if (!room) return <div style={{ padding: 20 }}>Đang tải...</div>;

    return (
        <DashboardLayout>
            <div className="p-6">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => history.goBack()}
                    style={{ marginBottom: 16 }}
                >
                    Quay lại
                </Button>

                <Card
                    title={<Title level={3}>{room.roomName}</Title>}
                    extra={
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => history.push(`/dashboard/admin/hotels/${hotelId}/edit-room/${roomId}`)}
                        >
                            Chỉnh sửa phòng
                        </Button>
                    }
                >
                    <Descriptions bordered column={2}>
                        <Descriptions.Item label="ID Phòng">{room.roomId}</Descriptions.Item>
                        <Descriptions.Item label="Thuộc khách sạn">{hotel.hotelName}</Descriptions.Item>

                        <Descriptions.Item label="Loại phòng">
                            <ApartmentOutlined /> {room.roomType}
                        </Descriptions.Item>

                        <Descriptions.Item label="Giá / Đêm">
                            <DollarOutlined /> {room.roomPricePerNight?.toLocaleString()} VND
                        </Descriptions.Item>

                        <Descriptions.Item label="Sức chứa">
                            <TeamOutlined /> {room.roomOccupancy} người
                        </Descriptions.Item>

                        <Descriptions.Item label="Trạng thái">
                            {room.roomStatus === "AVAILABLE" ? (
                                <Tag icon={<CheckCircleOutlined />} color="green">
                                    {room.roomStatus}
                                </Tag>
                            ) : (
                                <Tag icon={<CloseCircleOutlined />} color="volcano">
                                    {room.roomStatus}
                                </Tag>
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Divider />

                {/* Tiện ích khách sạn */}
                <Card title="Tiện ích phòng">
                    {hotel.hotelFacilities?.map((f, i) => (
                        <Tag key={i} color="blue">{f.name}</Tag>
                    ))}
                </Card>
                <Divider />

                {/* Hình ảnh phòng */}
                <Card title="Hình ảnh phòng">
                    <Image.PreviewGroup>
                        {room.roomImageUrls?.length > 0 ? (
                            room.roomImageUrls.map((img, index) => (
                                <Image
                                    key={index}
                                    width={250}
                                    src={img}
                                    style={{ marginRight: 15, borderRadius: 8 }}
                                />
                            ))
                        ) : (
                            <p>Phòng này chưa có hình ảnh.</p>
                        )}
                    </Image.PreviewGroup>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default RoomDetailAdmin;
