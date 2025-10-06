// src/api.js
//thực hiện gọi đến backend với axios 
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api"
});

// Gắn token mới nhất từ localStorage mỗi lần gửi request
//Token ở đây được lưu ở LocalStorage sau mỗi lần đăng nhập
api.interceptors.request.use(config => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
