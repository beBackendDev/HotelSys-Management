import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, Form, Input, Row, Typography } from "antd";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { rules } from "../../constant/rules";
import { register } from "../../slices/auth.slice";
import { useState } from "react";
import Logo from "../../assets/images/Logo.png";
import styles from "./auth.module.scss";

const Register = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState("");
  const onFinish = async (values) => {
    const { fullname, username, password } = values;
    const data = { fullname, username, password };
    try {
      const res = await dispatch(register(data));
      unwrapResult(res);
      toast.success(
        "Bạn đã đăng kí thành công! Vui lòng đăng nhập để tiếp tục",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      history.push("/");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        setError(error.response.data);
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className={styles.authWrapper}>
      <Row className={`${styles.authCard} ${styles.reverse}`}>
        {/* LEFT - Banner */}
        <Col xl={12} className={styles.bannerCol}>
          <img src={Logo} alt="Logo" className={styles.logo} />
        </Col>

        {/* RIGHT - Form */}
        <Col xl={12} className={styles.formCol}>
          <Typography.Title level={2} className={styles.formHeading}>
            Tạo tài khoản
          </Typography.Title>
          <Form
            className={styles.form}
            layout="vertical"
            name="register"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >

            {/* Fullname */}
            <Form.Item
              label="Họ và tên"
              name="fullname"
              rules={rules.fullname}
            // className={styles.formItem}
            >
              <Input placeholder="Nhập họ và tên" />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label="Email"
              name="username"
              rules={rules.email}
              validateStatus={error ? "error" : ""}
              help={error || null}
            // className={styles.formItem}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={rules.password}
            // className={styles.formItem}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>

            {/* Confirm password */}
            <Form.Item
              name="confirm"
              label="Xác nhận mật khẩu"
              dependencies={["password"]}
              // className={styles.formItem}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu không khớp")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            {/* Submit */}
            <Form.Item className={styles.submitRow}>
              <div className={styles.submitLayout}>
                {/* LEFT */}
                <div className={styles.submitLeft}>
                  <span>Bạn đã có tài khoản?</span>
                  <Link to="/login">Đăng nhập</Link>
                </div>

                {/* RIGHT */}
                <div className={styles.submitRight}>
                  <Button type="primary" htmlType="submit">
                    Đăng ký
                  </Button>
                </div>
              </div>
            </Form.Item>



          </Form>
        </Col>
      </Row>
    </div>
  );

};

export default Register;
