import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import HomeLayout from "../../core/layout/HomeLayout";
import { path } from "../../constant/path";

const { Title, Text } = Typography;

const ForgetPw = () => {
  const [form] = Form.useForm();
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Gửi OTP
  const handleSendOtp = async () => {
    try {
      const email = form.getFieldValue("email");
      if (!email) {
        message.warning("Vui lòng nhập email trước khi gửi OTP!");
        return;
      }
      setLoading(true);
      console.log(" Sending OTP to:", email);
      const payload = {
        email: email,
      }
      // Gọi API gửi OTP (ví dụ)
      const res = await fetch("http://localhost:8080/api/user/public/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        message.error("Địa chỉ gmail không tồn tại!");
      }
      message.success("Mã OTP đã được gửi đến email của bạn!");
      setOtpSent(true);
    } catch (error) {
      message.error("Không thể gửi OTP, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Xác nhận reset mật khẩu
  const onFinish = async (values) => {
    console.log("Reset password:", values);
    // Gọi API reset password tại đây
    // await axios.post("/api/auth/reset-password", values);
    const payload = {
      ...values,
    }
    const res = await fetch("http://localhost:8080/api/user/public/reset-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (res.ok) {
      message.success("Đặt lại mật khẩu thành công!");
      //điều hướng lại trang đăng nhập
      window.location.href = path.login;

    }
    else {
      message.error("Đặt lại mật khẩu thất bại!");
      window.location.href = path.forgetPw;

    }
    form.resetFields();
    setOtpSent(false);
  };

  return (
    <HomeLayout>
      <div className="flex justify-center items-center min-h-[80vh] bg-gray-50">
        <Card
          style={{
            width: 420,
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            borderRadius: "12px",
          }}
        >
          <Title level={3} style={{ textAlign: "center", marginBottom: 10 }}>
            Quên mật khẩu
          </Title>
          <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 20 }}>
            Nhập email để nhận mã OTP xác thực và đặt lại mật khẩu
          </Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Nhập email đã đăng ký" />
            </Form.Item>

            {/* OTP */}
            {otpSent && (
              <Form.Item
                label="Mã OTP"
                name="otpCode"
                rules={[{ required: true, message: "Vui lòng nhập mã OTP!" }]}
              >
                <Input placeholder="Nhập mã OTP gồm 6 chữ số" maxLength={6} />
              </Form.Item>
            )}

            {/* New password */}
            {otpSent && (
              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
            )}

            {/* Actions */}
            {!otpSent ? (
              <Button
                type="primary"
                block
                onClick={handleSendOtp}
                loading={loading}
              >
                Gửi mã OTP
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                Xác nhận đặt lại mật khẩu
              </Button>
            )}
          </Form>
        </Card>
      </div>
    </HomeLayout>
  );
};

export default ForgetPw;
