import { Col, Menu, Row } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  SettingOutlined,
  HomeTwoTone,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { path } from "../../constant/path";
import { logout } from "../../slices/auth.slice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";


const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const role = useSelector((state) => state.auth.profile.user.role);
  const handleLogout = async () => {
    try {
      const res = await dispatch(logout());
      unwrapResult(res);
      history.push("login");
    } catch (error) {
      console.log(error);
    }
  };

  // Menu theo role
  const ownerMenu = [
    { key: path.overview, icon: <HomeTwoTone />, label: "Tổng quan", link: path.overview },
    { key: path.hotelManagement, icon: <HomeOutlined />, label: "Quản lý khách sạn", link: path.hotelManagement },
    { key: "roomManagement", icon: <HomeTwoTone />, label: "Quản lý đặt phòng", link: "#" },
    { key: path.bookingManagement, icon: <HomeOutlined />, label: "Quản lý hóa đơn", link: "#" },
    { key: "reviewManagement", icon: <FileDoneOutlined />, label: "Quản lý đánh giá", link: "#" },
    { key: "settings", icon: <LogoutOutlined />, label: "Đăng xuất", link: path.login, onclick: handleLogout },
  ];

  const adminMenu = [
    { key: path.overview, icon: <HomeTwoTone />, label: "Tổng quan", link: path.overview },
    { key: path.userManagement, icon: <UserOutlined />, label: "Quản lý người dùng", link: path.userManagement },
    { key: path.hotelManagement, icon: <HomeOutlined />, label: "Quản lý khách sạn", link: path.hotelManagement },
    { key: path.bookingManagement, icon: <HomeOutlined />, label: "Quản lý đặt phòng", link: path.bookingManagement },
    { key: "invoiceManagement", icon: <FileSearchOutlined />, label: "Quản lý hóa đơn", link: path.paymentManagement },
    { key: "settings", icon: <LogoutOutlined />, label: "Đăng xuất", link: path.login, onclick: handleLogout },
  ];

  // Chọn menu theo role
  const menuItems = role === "OWNER" ? ownerMenu : adminMenu;

  return (
    <Row gutter={[16, 16]}>
      <Col md={4}>
        <div className="bg-white min-h-4/5 py-8">
          <Link to="/">
            <div className="flex items-center px-4">
              <div className="w-12 h-12 rounded-lg">
                <img src={Logo} alt="Logo" />
              </div>
              <span className="ml-3 font-bold capitalize cursor-pointer">
                Hotel Booking
              </span>
            </div>
          </Link>
          <Menu className="mt-5" defaultSelectedKeys={[location.pathname]}>
            {menuItems.map((item) => (
              <Menu.Item key={item.key}>
                <Link to={item.link} style={{ display: "flex", alignItems: "center" }}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        </div>
      </Col>
      <Col md={20} className="min-h-screen bg-gray-100">
        {children}
      </Col>
    </Row>
  );
};

export default DashboardLayout;
