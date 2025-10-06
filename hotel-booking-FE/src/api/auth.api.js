import http from "../utils/http";

const authApi = {
  register(data) {
    // return http.post("user/register", data);
    return http.post("api/auth/register", data);
  },
  login(data) {
    return http.post("api/auth/login", data);
  },
  registerMember(data) {
    return http.post("user/manager", data);
  },
  updateProfile(data) {
    return http.put("api/user/profile/update", data);
  },
  changePass(data) {
    // return http.put("user/pass", data); //code cũ
    return http.put("api/user/profile/change-password", data);
  },
logout(refreshToken) {
  return http.post("api/auth/logout", {
    refreshToken: refreshToken
  });
},
  // Thêm hàm lấy thông tin người dùng từ token
  getMe() {
    return http.get(`api/user/profile`); // hoặc endpoint phù hợp với backend của bạn
  },
  refreshToken(data) {
    return http.post(`api/auth/refresh`, data); // hoặc endpoint đúng với backend bạn
  },
};

export default authApi;
