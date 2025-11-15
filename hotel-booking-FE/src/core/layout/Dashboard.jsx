import { Col, Menu, Row } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  HomeTwoTone,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import { path } from "../../constant/path";

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const role = useSelector((state) => state.auth.profile.user.role);

  console.log("Role Dashboard: ", role);

  // Menu theo role
  const ownerMenu = [
    { key: path.overview, icon: <HomeTwoTone />, label: "Tổng quan", link: path.overview },
    { key: path.hotelManagement, icon: <HomeOutlined />, label: "Quản lý khách sạn", link: path.hotelManagement },
    { key: "roomManagement", icon: <HomeTwoTone />, label: "Quản lý phòng", link: "#" },
    { key: path.bookingManagement, icon: <HomeOutlined />, label: "Quản lý đặt phòng", link: "#" },
    { key: "reviewManagement", icon: <FileDoneOutlined />, label: "Quản lý đánh giá", link: "#" },
  ];

  const adminMenu = [
    { key: path.overview, icon: <HomeTwoTone />, label: "Tổng quan", link: path.overview },
    { key: "/dashboard/users", icon: <UserOutlined />, label: "Quản lý người dùng", link: "/dashboard/users" },
    { key: path.hotelManagement, icon: <HomeOutlined />, label: "Quản lý khách sạn", link: path.hotelManagement },
    { key: path.bookingManagement, icon: <HomeOutlined />, label: "Quản lý đặt phòng", link: "#" },
    { key: "invoiceManagement", icon: <FileSearchOutlined />, label: "Quản lý hóa đơn", link: "#" },
    { key: "reviewManagement", icon: <FileDoneOutlined />, label: "Quản lý đánh giá", link: "#" },
    { key: "tourManagement", icon: <EnvironmentOutlined />, label: "Quản lý điểm du lịch", link: "#" },
    { key: "settings", icon: <SettingOutlined />, label: "Cài đặt hệ thống", link: "#" },
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
