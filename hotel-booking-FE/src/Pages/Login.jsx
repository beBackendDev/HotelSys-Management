import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Checkbox, Col, Form, Input, Row, Typography } from "antd";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { rules } from "../constant/rules";
import { login } from "../slices/auth.slice";
import authApi from "../api/auth.api"; // thêm import getMe
import { setProfile } from "../slices/auth.slice"; // import action
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import styles from "../styles/pages/login.module.scss";
import { toast } from "react-toastify";
import Logo from "../assets/images/Logo.png";
import { path } from "../constant/path";


const Login = ({ heading, role }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState("");
  const onFinish = async (values) => {
    try {
      const res = await dispatch(login(values));//lấy thông tin nhập vào ở form đăng nhập (username pw)
      const unwraped = unwrapResult(res);
      toast.success("Đăng nhập thành công");
      //decode jwt để kiểm tra role
      const token = unwraped?.data?.accessToken;// lưu mã token
      const refreshToken = unwraped?.data?.refreshToken;// lưu mã refresh token
      const decoded = jwtDecode(token); //giải mã
      console.log(">>response decode token: ", decoded);

      const role_decoded = decoded.role; //lấy rolename từ token đã được giải mã
      // console.log(">>response decode role: ", role_decoded);  

      // Gọi API lấy thông tin chi tiết người dùng
      const meResponse = await authApi.getMe();
      const userData = meResponse.data;
      console.log(">>_Login.jsx__thông tin người dùng :", meResponse);

      //Lưu vào Redux và localStorage
      // dispatch(setProfile(userData));
      // localStorage.setItem("user", JSON.stringify(userData));
      // localStorage.setItem("accessToken", token);
      // localStorage.setItem("refreshToken", refreshToken);
      // localStorage.setItem("role", role_decoded);

      // Điều hướng theo role
      if (role_decoded === "ADMIN") {
        history.push("/dashboard");//admin
      } else if (role_decoded === "OWNER") {
        history.push("/owner/dashboard");
      } else {
        history.push("/");
      }
    } catch (error) {
      if (error.status === 405) {
        setError(error.data.message);
      }
      else {
        toast.error("Đăng nhập thất bại, vui lòng thử lại.");
      }
    }
  };
  //Gọi API để lấy thông tin người dùng



  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Row
        gutter={0}
        className="bg-white shadow-lg rounded-2xl overflow-hidden w-[90%] md:w-[70%] lg:w-[60%]"
      >
        {/* Cột trái - Form */}
        <Col
          xs={24}
          lg={role !== 2 ? 12 : 24}
          className="p-8 flex flex-col justify-center bg-slate-200"
        >
          <Typography.Title
            level={2}
            className="text-center text-blue-600 mb-8"
          >
            {heading || "Đăng nhập"}
          </Typography.Title>

          <Form
            layout="vertical"
            name="login"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {/* Email */}
            <Form.Item
              label="Email"
              name="username"
              rules={rules?.email || [{ required: true, message: "Vui lòng nhập email!" }]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            {/* Mật khẩu */}
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={rules?.password || [{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              validateStatus={error ? "error" : ""}
              help={error || ""}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            {/* Lưu thông tin + Quên mật khẩu */}
            <div className="flex justify-between items-center mb-4">
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              <Link
                to={path.forgetPw}
                className="text-blue-500 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Nút đăng nhập */}
            <Form.Item className="text-center mt-6">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Đăng nhập
              </Button>
            </Form.Item>

            {/* Link đăng ký */}
            {role !== 2 && (
              <div className="text-center mt-4">
                <span>Chưa có tài khoản? </span>
                <Link to="/register" className="text-blue-500 hover:underline">
                  Đăng ký ngay
                </Link>
              </div>
            )}
          </Form>
        </Col>

        {/* Cột phải - Banner */}
        {role !== 2 && (
          <Col
            lg={12}
            className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-sky-400 to-sky-500 p-10"
          >
            <img src={Logo} alt="Logo" className="w-{100px} h-{100px} object-contain" />

          </Col>
        )}
      </Row>
    </div>
  );
};

export default Login;
