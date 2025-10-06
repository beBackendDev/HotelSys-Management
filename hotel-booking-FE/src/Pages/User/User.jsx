import { HistoryOutlined, KeyOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Image, Menu, Row, Typography } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";
import logo from "../../assets/images/Logo.png";
import defaultImg from "../../assets/images/img-placeholder.jpg";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { path } from "../../constant/path";
import HomeLayout from "../../core/layout/HomeLayout";

const User = ({ children }) => {
  const { user } = useSelector((state) => state.auth.profile);
  console.log(">>User Info:", user);
  const location = useLocation();
  return (
    <HomeLayout>
      <Content className="max-w-6xl min-h-screen mx-auto mt-[100px]">
        <Row gutter={[16, 16]}>
          <Col sm={4} className="bg-white py-5 min-h-screen">
            <div className="flex justify-center">
              <Image
                className="border border-orange-500 w-[100px]"
                src={logo || defaultImg}
              />
            </div>

            <Typography.Text className="inline-block ml-4 font-semibold">
              {user.lastName}
            </Typography.Text>
            <Menu
              className="profile-menu mt-8"
              defaultSelectedKeys={location.pathname}
            >
              <Menu.Item key={path.user} icon={<UserOutlined />}>
                <Link to={path.user}>Trang cá nhân</Link>
              </Menu.Item>
              <Menu.Item key={path.purchase} icon={<HistoryOutlined />}>
                <Link to={path.purchase}>Lịch sử đặt phòng</Link>
              </Menu.Item>
              <Menu.Item key={path.changePass} icon={<KeyOutlined />}>
                <Link to={path.changePass}>Đổi mật khẩu</Link>
              </Menu.Item>
            </Menu>
          </Col>
          <Col sm={20}>{children}</Col>
        </Row>
      </Content>
    </HomeLayout>
  );
};

export default User;
