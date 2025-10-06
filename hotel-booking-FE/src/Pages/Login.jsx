import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, Form, Input, Row } from "antd";
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
    <>
      <div className="overflow-hidden">
        <Row>
          <Col xl={role === 1 ? 12 : 24}>
            <div className={styles.formContainer}>
              <Form
                className={styles.form}
                name="basic"
                initialValues={{
                  remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item>
                  <div className="text-center flex items-center flex-col justify-center">
                    <h1 className={styles.formHeading}>{heading}</h1>
                  </div>
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="username"
                  rules={rules.email}>
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={rules.password}
                  validateStatus="error"
                  help={error || null}
                >
                  <Input.Password />
                </Form.Item>

                <div className="flex justify-center mt-6">
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Login
                    </Button>
                  </Form.Item>
                </div>
                {role !== 2 ? (
                  <div>
                    <span>Bạn chưa có tài khoản?.</span>
                    <Link to="/register">Đăng kí</Link>
                  </div>
                ) : null}
              </Form>
            </div>
          </Col>
          {role === 1 ? (
            <Col xl={12}>
              <div className={styles.loginRight}>
                <span>Go happy, go anywhere.</span>
                <h1>Stay here</h1>
              </div>
            </Col>
          ) : null}
        </Row>
      </div>
    </>
  );
};

export default Login;
