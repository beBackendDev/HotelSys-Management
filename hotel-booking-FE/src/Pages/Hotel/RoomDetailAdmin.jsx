import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { EditOutlined, ArrowLeftOutlined, } from "@ant-design/icons";
import DashboardLayout from "../../core/layout/Dashboard";

const RoomDetailAdmin = () => {
    const { hotelId } = useParams();
    const { roomId } = useParams();
    const history = useHistory();
    const [room, setRoom] = useState(null);
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/admin/hotels/${hotelId}/rooms/${roomId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch room");
                const data = await res.json();
                setRoom(data);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        };
        fetchRoom();
    }, [roomId, token]);

    if (!room) return <div>Đang tải...</div>;

    return (
        <DashboardLayout>
            <div className="p-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => history.goBack()}
                            className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                        >
                            <div className="flex flex-row">
                                <ArrowLeftOutlined />
                                <span>Quay lại</span>
                            </div>
                        </button>
                        <h1 className="text-2xl font-bold">
                            {room.roomName} (ID: {room.roomId})
                        </h1>
                    </div>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded">
                        <EditOutlined /> Sửa phòng
                    </button>
                </div>

                {/* Room details */}
                <p>
                    <strong>Loại phòng:</strong> {room.roomType}
                </p>
                <p>
                    <strong>Sức chứa:</strong> {room.roomOccupancy} người
                </p>
                <p>
                    <strong>Giá/đêm:</strong>{" "}
                    {room.roomPricePerNight?.toLocaleString()} VND
                </p>
                <p>
                    <strong>Trạng thái:</strong> {room.roomStatus}
                </p>
                <p>
                    <strong>Hotel ID:</strong> {room.hotelId}
                </p>

                {/* Images */}
                <div className="mt-4">
                    <strong>Hình ảnh phòng:</strong>
                    {room.roomImageUrls && room.roomImageUrls.length > 0 ? (
                        <div className="grid grid-cols-3 gap-4 mt-2">
                            {room.roomImageUrls.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Room ${index}`}
                                    className="w-full h-32 object-cover rounded border"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Không có ảnh</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default RoomDetailAdmin;
