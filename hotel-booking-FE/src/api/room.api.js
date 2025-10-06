import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const roomApi = {
  // Tạo phòng mới
  createRoom: async (hotelId, data) => {
    const token = localStorage.getItem("accessToken");
    return axios.post(
      `${BASE_URL}/admin/hotels/${hotelId}/rooms`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(res => res.data);
  },

  // Lấy danh sách phòng theo hotelId
  getRoomByHotelId: async (hotelId) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(
      `${BASE_URL}/admin/hotels/${hotelId}/rooms`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(res => res.data);
  },

    // Lấy danh sách phòng theo hotelId
  userGetRoomByHotelId: async (hotelId) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(
      `${BASE_URL}/user/public/hotels/${hotelId}/rooms`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(res => res.data);
  },
  // Tìm kiếm phòng theo roomId
  searchRoomById: async (hotelId, roomId) => {
    const token = localStorage.getItem("accessToken");
    return axios.get(
      `${BASE_URL}/admin/hotels/${hotelId}/rooms/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(res => res.data);
  },

  // Xóa phòng
  deleteRoomById: async (hotelId, roomId) => {
    const token = localStorage.getItem("accessToken");
    return axios.delete(
      `${BASE_URL}/admin/hotels/${hotelId}/rooms/${roomId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(res => res.data);
  },

  // Cập nhật phòng
  updateRoomById: async (hotelId, roomId, data) => {
    const token = localStorage.getItem("accessToken");
    console.log("token: ", token)
    return axios.put(
      `${BASE_URL}/admin/hotels/${hotelId}/update-room/${roomId}`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    ).then(res => res.data);
  },
};
