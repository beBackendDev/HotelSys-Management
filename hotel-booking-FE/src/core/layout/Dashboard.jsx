import { Col, Menu, Row } from "antd";
import Icon, {
  DashboardOutlined,
  UserOutlined,
  HomeOutlined,
  AppstoreOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  StarOutlined,
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
  const { hotel } = useSelector((state) => state.auth.profile);
  return (
    <Row gutter={[16, 16]}>
      <Col md={4}>
        <div className="bg-white min-h-4/5 py-8 ">
          <Link to="/">
            <div className="flex items-center px-4">
              <div className="w-12 h-12 rounded-lg">
                <img src={Logo} alt="" />
              </div>
              <span className="ml-3 font-bold capitalize cursor-pointer">
                Hotel Booking
              </span>
            </div>
          </Link>
          <Menu className="mt-5" defaultSelectedKeys={location.pathname}>
            <Menu.Item key={path.overview}>
              <Link to={path.overview} style={{ display: "flex", alignItems: "center" }}>
                <HomeTwoTone />
                <span>Tổng quan</span>
              </Link>
            </Menu.Item >
            <Menu.Item key="/dashboard/users">
              <Link
                to="/dashboard/users"
                style={{ display: "flex", alignItems: "center" }}
              >
                <UserOutlined style={{ marginRight: 1 }} />
                <span>Quản lý người dùng</span>
              </Link>
            </Menu.Item>


            <Menu.Item key={path.hotelManagement}>
              <Link to={path.hotelManagement}
                style={{ display: "flex", alignItems: "center" }}>
                <HomeOutlined style={{ marginRight: 1 }} />
                <span>Quản lý khách sạn</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link  style={{ display: "flex", alignItems: "center" }}>
                <HomeTwoTone />
                <span>Quản lý phòng</span>
              </Link>
            </Menu.Item>
            <Menu.Item key={path.bookingManagement}>
              <Link
                // to={`/dashboard/booking-management/hotel?hotel_id=${hotel.hotelId}&page=1&status=0`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <HomeOutlined />
                <span>Quản lý đặt phòng</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                // to={`/dashboard/booking-management/hotel?hotel_id=${hotel.hotelId}&page=1&status=0`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <FileSearchOutlined />
                <span>Quản lý hóa đơn</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                // to={`/dashboard/booking-management/hotel?hotel_id=${hotel.hotelId}&page=1&status=0`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <FileDoneOutlined />
                <span>Quản lý đánh giá</span>
              </Link>
            </Menu.Item>

            <Menu.Item>
              <Link
                // to={`/dashboard/booking-management/hotel?hotel_id=${hotel.hotelId}&page=1&status=0`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <EnvironmentOutlined />
                <span>Quản lý điểm du lịch</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                // to={`/dashboard/booking-management/hotel?hotel_id=${hotel.hotelId}&page=1&status=0`}
                style={{ display: "flex", alignItems: "center" }}
              >
                <SettingOutlined />
                <span>Cài đặt hệ thống</span>
              </Link>
            </Menu.Item>
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
