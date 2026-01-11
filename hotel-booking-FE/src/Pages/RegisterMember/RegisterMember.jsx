import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Input, Select } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import UploadImage from "../../common/UploadImage";
import { province } from "../../constant/province";
import { rules } from "../../constant/rules";
import HomeLayout from "../../core/layout/HomeLayout";
import { registerMember } from "../../slices/auth.slice";
import styles from "./styles.module.scss";
import Footer from "../../components/Footer/Footer";
const RegisterMember = () => {
  const [banner, setBanner] = useState("");
  const [progress, setProgress] = useState(0);
  const userId = useSelector((state) => state.auth.profile.user.id);

  const dispatch = useDispatch();
  const history = useHistory();
  const onFinish = async (values) => {
    const province = values["province_id"];
    const token = localStorage?.getItem("accessToken");
    const payload = {
      ...values,
      // province_id: String(province),
      // user_id: String(userId),
      // image: banner?.url || banner,
    };
    const _registerMember = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/user/owner-request`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        console.log("(RegisterMember)response register Owner:", data);
        toast.success("Yêu cầu của bạn đã được gửi đi");
        history.push("/");
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);

      }
    };
    _registerMember();
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleDefaultBanner = () => {
    setBanner(
      "https://res.cloudinary.com/dnykxuaax/image/upload/v1652715094/ibp9pfvutk5uhxmtgeyy.jpg"
    );
    setProgress(100);
  };
  return (
  <HomeLayout>
    <Content className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.inner}>
          {/* TITLE */}
          <div className={styles.header}>
            <h1>Tham gia cùng chúng tôi</h1>
            <p>Đăng ký trở thành đối tác kinh doanh khách sạn</p>
          </div>

          {/* FORM */}
          <div className={styles.formRegisterMemberContainer}>
            <Form
              className={styles.formRegisterMember}
              name="register-member"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item
                label="Mã số cấp phép kinh doanh"
                name="businessLicenseNumber"
                rules={[
                  { required: true, message: "Trường này không được bỏ trống" },
                ]}
              >
                <Input placeholder="Nhập mã số kinh doanh" />
              </Form.Item>

              <Form.Item
                label="Kinh nghiệm trong ngành khách sạn"
                name="experienceInHospitality"
                rules={[
                  { required: true, message: "Trường này không được bỏ trống" },
                ]}
              >
                <Input placeholder="Ví dụ: 5 năm quản lý khách sạn" />
              </Form.Item>

              <Form.Item
                label="Thông tin mô tả bản thân"
                name="ownerDescription"
                rules={[
                  { required: true, message: "Trường này không được bỏ trống" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Giới thiệu ngắn gọn về bạn hoặc doanh nghiệp"
                />
              </Form.Item>

              <div className={styles.submitContainer}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className={styles.submitBtn}
                >
                  Đăng ký thành viên
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </Content>
  <Footer />
  </HomeLayout>
);

};

export default RegisterMember;
