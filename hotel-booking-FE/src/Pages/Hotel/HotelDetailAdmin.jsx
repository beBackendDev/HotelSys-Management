import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  SearchOutlined,
  MoreOutlined,
  EditOutlined,
  EyeOutlined,
  UserSwitchOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import DashboardLayout from '../../core/layout/Dashboard';
import { toast } from 'react-toastify';
import { path } from '../../constant/path';

const HotelDetailAdmin = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const token = localStorage.getItem("accessToken");
  const handleViewDetail = (hotelId, roomId) => {
    history.push(path.roomDetailAdminPath(hotelId, roomId))
  }
  const handleChangeRoom = (hotelId, roomId) => {
    history.push(path.roomProfileUrl(hotelId, roomId))

  }
  const handleCreateRoom = () => {
    history.push(path.createRoom(hotelId))

  }
  const fetchRooms = async () => {
    try {

      // Lấy danh sách phòng
      const roomRes = await fetch(`http://localhost:8080/api/admin/hotels/${hotelId}/rooms`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!roomRes.ok) throw new Error("Failed to fetch rooms");
      const roomData = await roomRes.json();
      setRooms(roomData);
    } catch (error) {
      console.error("Fetch error:", error);
      // Bạn có thể hiển thị thông báo lỗi ở đây
    }
  };

  useEffect(() => {
    //lấy thông tin khách sạn
    const fetchData = async () => {
      try {
        // Lấy thông tin khách sạn
        const hotelRes = await fetch(`http://localhost:8080/api/admin/hotels/${hotelId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!hotelRes.ok) throw new Error("Failed to fetch hotel");
        const hotelData = await hotelRes.json();
        setHotel(hotelData);

        // Lấy danh sách phòng
        await fetchRooms();
      } catch (error) {
        console.error("Fetch error:", error);
        // Bạn có thể hiển thị thông báo lỗi ở đây
      }
    };

    fetchData();
  }, [hotelId]);
  //xóa phòng
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá phòng này?")) return;
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`http://localhost:8080/api/admin/hotels/${hotelId}/delete-room/${roomId}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Xoá phòng thất bại");

      setRooms(prev => prev.filter(r => r.id !== roomId));
      toast.success("Đã xoá phòng thành công!");
      fetchRooms();
    } catch (error) {
      console.error("Delete error:", error);
      toast.warn("Đã xảy ra lỗi khi xoá phòng.");
    }
  };

  const history = useHistory();

  if (!hotel) return <div>Đang tải...</div>;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto">
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
            <h1 className="text-2xl font-bold">{hotel.hotelName} (ID: {hotel.hotelId})</h1>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Sửa khách sạn</button>
        </div>
        <p><strong>Địa chỉ:</strong> {hotel.hotelAddress}</p>
        <p><strong>Owner:</strong> {hotel.hotelOwner} ({hotel.ownerEmail})</p> {/*Chưa thiết lập*/}
        <p><strong>Trạng thái:</strong> {hotel.status}</p> {/*Chưa thiết lập*/}
        <p><strong>Tiện nghi:</strong> {hotel.hotelFacility}</p>
        <p><strong>Mô tả:</strong> {hotel.hotelDescription}</p>

        <hr className="my-6" />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Danh sách phòng</h2>
          <button className="px-3 py-2 bg-green-500 text-white rounded" onClick={() => handleCreateRoom()}>+ Thêm phòng</button>
        </div>

        <table className="w-full border table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">STT</th>
              <th className="p-2">Tên phòng</th>
              <th className="p-2">Giá/đêm</th>
              <th className="p-2">Loại phòng</th>
              <th className="p-2">Sức chứa</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={room.roomId} className="text-center border-t">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{room.roomName}</td>
                <td className="p-2">{room.roomPricePerNight?.toLocaleString()} VND</td>
                <td className="p-2">{room.roomType}</td>
                <td className="p-2">{room.roomOccupancy} người</td>
                <td className="p-2">{room.roomStatus}</td>
                <td className="p-2">
                  <button className="text-blue-600 hover:underline mr-2" onClick={() => handleViewDetail(hotelId, room.roomId)}><EyeOutlined /> </button>
                  <button className="text-blue-600 hover:underline mr-2" onClick={() => handleChangeRoom(hotelId, room.roomId)}><EditOutlined /></button>
                  <button
                    onClick={() => handleDeleteRoom(room.roomId)}
                    className="text-blue-600 hover:underline"
                  ><DeleteOutlined /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default HotelDetailAdmin;
