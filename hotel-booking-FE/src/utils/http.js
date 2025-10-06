import axios from "axios";
import { toast } from "react-toastify";
import LocalStorage from "../constant/localStorage";
import authApi from "../api/auth.api"; // cần có hàm gọi API refresh

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
class Http {
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.REACT_APP_API,
      name: " do an",
      // mode: "no-cors",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    //Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {

        const userData = JSON.parse(localStorage.getItem(LocalStorage.user));
        // console.log("http userData: ", userData);
        const refreshToken = localStorage.getItem("refreshToken");
        // console.log("http refresh token ", refreshToken);

        // console.log("http local token ", localStorage.getItem("accessToken"));
        // console.log("http userDta token ", userData?.accessToken);

        const accessToken = localStorage.getItem("accessToken") || userData?.accessToken || "";
        console.log("http token ", accessToken);
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error.response);
      }
    );
    //Response Interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const response = error.response;
        // console.log("accessToken in localStorage:", localStorage.getItem("accessToken"));
        // console.log("refreshToken in localStorage:", localStorage.getItem("refreshToken"));


        if (response?.status === 401 && !originalRequest._retry) {
          const userData = JSON.parse(localStorage.getItem(LocalStorage.user));
          const refreshToken = localStorage.getItem("refreshToken");


          if (!refreshToken) {
            toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(error);
          }

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return this.instance(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const res = await authApi.refreshToken({ refreshToken });
            // console.log("http get refresh Token: ", res.data);
            const newAccessToken = res.data.accessToken;
            const newRefreshToken = res.data.refreshToken;
            // Update localStorage
            const newUserData = {
              ...userData,
              accessToken: newAccessToken,
              refreshToken: newRefreshToken // cập nhật luôn nếu backend trả refreshToken mới
            };
            // Cập nhật lại localStorage
            localStorage.setItem(LocalStorage.user, JSON.stringify(newUserData));
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            processQueue(null, newAccessToken);

            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
            return this.instance(originalRequest);
          } catch (err) {
            processQueue(err, null);
            localStorage.clear();
            window.location.href = "/login";
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );



  }

  get(url, config = {}) {
    return this.instance.get(url, config);
  }
  post(url, data, config = {}) {
    return this.instance.post(url, data, config);
  }
  put(url, data, config = {}) {
    return this.instance.put(url, data, config);
  }
  delete(url, data, config = {}) {
    return this.instance.delete(url, {
      data,
      ...config,
    });
  }
}

const http = new Http();

export default http;
