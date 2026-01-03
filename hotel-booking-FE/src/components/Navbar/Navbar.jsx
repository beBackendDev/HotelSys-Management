import { DownOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Avatar, Button, Dropdown, Menu, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Logo from "../../assets/images/Logo.png";
import placeholder from "../../assets/images/img-placeholder.jpg";
import { path } from "../../constant/path";
import { useAuthenticated } from "../../core/hooks/useAuthenticated";
import { logout } from "../../slices/auth.slice";
import styles from "./style.module.scss";
import { useEffect, useState } from "react";
const DropDownList = ({ roleId }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = async () => {
    try {
      const res = await dispatch(logout());
      unwrapResult(res);
      history.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Menu>
      <Menu.Item key="0">
        <Link to={path.user}>Trang cá nhân</Link>
      </Menu.Item>
      {roleId === 2 ? (
        <>
          <Menu.Item key="2">
            <Link to={`${path.dashboard}/overview`}>Dashboard</Link>
          </Menu.Item>
        </>
      ) : null}
      <Menu.Item key="1">
        <Link to={path.login} onClick={handleLogout}>
          Đăng xuất
        </Link>
      </Menu.Item>
    </Menu>
  );
};
const Navbar = () => {
  const [user, setUser] = useState([]);
  const token = localStorage?.getItem("accessToken");
  const userStr = localStorage?.getItem("user");
  const userLocal = JSON.parse(userStr);
  const userId = userLocal?.userId;
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/user/public/profile/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });
        const data = await res.json();
        console.log("(Navbar)API-UserProfile:", data);
        setUser(data);

      } catch (error) {
        console.error("Lỗi khi lấy danh sách đánh giá:", error);

      }
    }
    fetchUser();
  }, [userId]);
  const profile = useSelector((state) => state.auth.profile);
  const roleName = profile?.user?.roleName;
  const authenticated = useAuthenticated();

  //scrolling
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // chỉnh ngưỡng tùy bạn
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`z-10 flex w-full px-8 py-6 justify-between items-center text-sm text-white 
  ${styles.navbarWrapper} 
  ${styles.navbar} 
  ${isScrolled ? styles.scrolled : ""}
  `}
    >
      <div className="flex items-center">
        <Link to="/">

          <div className="w-8 h-8 rounded-lg">
            <img src={Logo} alt="" />
          </div>

        </Link>
        <span className=" ml-3 text-[25px] font-bold capitalize cursor-pointer">
          QuiNhon | Travel
        </span>
      </div>

      {/* Menu items */}
      <div className="flex items-center space-x-8">
        <Link to="/" className="font-medium">
          Trang chủ
        </Link>
        <Link to="/destinations" className="font-medium">
          Khám phá
        </Link>
        <Link to="/hotel/search" className="font-medium">
          Khách sạn
        </Link>
        <Link to="/contact" className="font-medium">
          Liên hệ
        </Link>
      </div>
      <div className="flex items-center">
        {authenticated && (
          <>
            {profile.user.roleName !== "ADMIN" ? (//roleid = 2 -> admin
              <Link to={path.registerMember}>
                <Button
                  type="primary"
                  className="mr-2 flex items-center py-2 px-3"
                >
                  <PlusOutlined />
                  Trở thành Host
                </Button>
              </Link>
            ) : null}

            <div className="flex items-center">
              <Dropdown overlay={DropDownList({ roleName })} trigger={["click"]}>
                <a href="/" className="flex items-center">
                  <Avatar src={user?.urlImg || placeholder}
                  />

                </a>
              </Dropdown>
            </div>
          </>
        )}
        {!authenticated && (
          <div className="flex items-center">
            <Button type="primary" className=" flex items-center ">
              <Link to={path.login}>Đăng nhập</Link>
            </Button>
            <Button type="outlined" className=" flex items-center ml-4">
              <Link to={path.register}>Đăng ký</Link>
            </Button>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
