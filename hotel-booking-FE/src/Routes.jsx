import React from "react";
import { Route, Switch } from "react-router-dom";
import { path } from "./constant/path";
import AuthenticatedGuard from "./core/guards/AuthenticatedGuard";
import HotelManagerGuard from "./core/guards/HotelManagerGuard";
import UnAuth from "./core/guards/UnAuth";
import Dashboard from "./core/layout/Dashboard";
import NotFound from "./core/layout/NotFound";
import Booking from "./Pages/Booking";
import Payment from "./Pages/Payment";
import HomePage from "./Pages/HomePage";
import Destinations from "./Pages/Destinations";
import BookingManagement from "./Pages/Hotel/BookingManagement";
import CreateRoom from "./Pages/Hotel/CreateRoom";
import Overview from "./Pages/Hotel/Overview";
import HotelDetail from "./Pages/HotelDetail";
import RoomDetail from "./Pages/RoomDetail";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import RegisterMember from "./Pages/RegisterMember";
import SearchPage from "./Pages/SearchPage";
import ChangePass from "./Pages/User/ChangePass";
import ForgetPw from "./Pages/User/ForgetPw";
import Profile from "./Pages/User/Profile";
import UpdateUser from "./Pages/User/UpdateUser";
import ReviewPage from "./Pages/User/ReviewPage";
import ReviewUser from "./Pages/User/ReviewUser";
import ProfileHotel from "./Pages/Hotel/HotelProfile";
import RoomProfile from "./Pages/Hotel/RoomProfile";
import Purchase from "./Pages/User/Purchase";
import HotelManagement from "./Pages/Hotel/HotelManagement";
import UserManagement from "./Pages/User/UserManagement";
import RoomManagement from "./Pages/Hotel/RoomManagement";
import HotelDetailAdmin from "./Pages/Hotel/HotelDetailAdmin";
import UserDetailAdmin from "./Pages/User/UserDetailAdmin";
import RoomDetailAdmin from "./Pages/Hotel/RoomDetailAdmin";
import CreateHotel from "./Pages/Hotel/CreateHotel";

const Routes = () => {
  return (
    <Switch>
      {/* Trang chủ */}
      <Route exact path={path.home} >
        <HomePage />
      </Route>
      {/* Khám phá */}
      <Route exact path={path.destinations} >
        <Destinations />
      </Route>
      {/* Tìm kiếm */}
      <Route exact path={path.searchHotel}>
        <SearchPage />
      </Route>
      {/* Chi tiết khách sạn */}
      <Route exact path={path.hotelDetail}>
        <HotelDetail />
      </Route>
      {/* Chi tiết phòng  */}
      <Route exact path={path.roomDetail}>
        <RoomDetail />
      </Route>
      {/* Phân quyền */}
      <Route exact path={path.bookingDetail}>
        <AuthenticatedGuard>
          <Booking />
        </AuthenticatedGuard>
      </Route>
      {/* Payment Route */}
      <Route exact path={path.payment}>
        <AuthenticatedGuard>
          <Payment />
        </AuthenticatedGuard>
      </Route>
      {/* Login/ Log out */}
      <Route exact path={path.login}>
        <UnAuth>
          <Login heading="Chào mừng trở lại" role={"user"} />
        </UnAuth>
      </Route>
      <Route exact path="/admin/login">
        <UnAuth>
          <Login heading="Hello admin" role={"admin"} />
        </UnAuth>
      </Route>

      <Route exact path={path.registerMember}>
        <AuthenticatedGuard>
          <RegisterMember />
        </AuthenticatedGuard>
      </Route>
      {/* Đăng kí */}
      <Route exact path={path.register}>
        <UnAuth>
          <Register />
        </UnAuth>
      </Route>
      {/* Chi tiết Người dùng (Admin) */}
      <Route exact path={path.user} >
        <AuthenticatedGuard>
          <Profile />
        </AuthenticatedGuard>
      </Route>
      {/* Cập nhật thông tin người dùng */}
      <Route exact path={path.updateUser} >
        <AuthenticatedGuard>
          <UpdateUser />
        </AuthenticatedGuard>
      </Route>
      {/* Thực hiện đánh giá */}
      <Route exact path={path.reviewPage} >
        <AuthenticatedGuard>
          <ReviewPage />
        </AuthenticatedGuard>
      </Route>
      {/* Xem lịch sử đánh giá */}
      <Route exact path={path.review} >
        <AuthenticatedGuard>
          <ReviewUser />
        </AuthenticatedGuard>
      </Route>
      {/* Thay đổi password */}
      <Route exact path={path.changePass}>
        <AuthenticatedGuard>
          <ChangePass />
        </AuthenticatedGuard>
      </Route>
      {/* Quên password */}
      <Route exact path={path.forgetPw}>
        <ForgetPw />
      </Route>
      {/* Thanh toán */}
      <Route exact path={path.purchase}>
        <Purchase />
      </Route>
      {/* Quản lý User(Admin) */}
      <Route exact path={path.userManagement}>
        <HotelManagerGuard>
          <UserManagement />
        </HotelManagerGuard>
      </Route>
      {/* Quản lý khách sạn(Admin/ Owner) */}
      <Route exact path={path.hotelManagement}>
        <HotelManagerGuard>
          <HotelManagement />
        </HotelManagerGuard>
      </Route>
      {/* Quản lý phòng(Admin/ Owner) */}
      <Route exact path={path.roomManagement}>
        <HotelManagerGuard>
          <RoomManagement />
        </HotelManagerGuard>
      </Route>
      <Route exact path={path.roomDetailAdmin}>
        <HotelManagerGuard>
          <RoomDetailAdmin />
        </HotelManagerGuard>
      </Route>
      <Route exact path={path.hotelDetailAdmin}>
        <HotelManagerGuard>
          <HotelDetailAdmin />
        </HotelManagerGuard>
      </Route>
          <Route exact path={path.userDetailAdmin}>
        <HotelManagerGuard>
          <UserDetailAdmin />
        </HotelManagerGuard>
      </Route>
      {/* tạo phòng(Admin/ Owner) */}
      <Route exact path={path.createRoom(":hotelId")}>
        <HotelManagerGuard>
          <CreateRoom />
        </HotelManagerGuard>
      </Route>
      {/* tạo Khách sạn(Admin/ Owner) */}
      <Route exact path={path.createHotel}>
        <HotelManagerGuard>
          <CreateHotel />
        </HotelManagerGuard>
      </Route>
      {/* Quản lý ds Booking(Admin/ Owner) */}
      <Route exact path={path.bookingManagement}>
        <HotelManagerGuard>
          <BookingManagement />
        </HotelManagerGuard>
      </Route>
      {/* QUản lý thông tin ks(Admin/ Owner) || có thể không cần dùng*/}
      <Route exact path={path.roomProfilePattern}>
        <HotelManagerGuard>
          <RoomProfile />
        </HotelManagerGuard>
      </Route>
      {/* thực hiện Onclick */}
      {/* <Route exact path={path.hotelProfileAdmin(":hotelId")}>
        <HotelManagerGuard>
          <ProfileHotel />
        </HotelManagerGuard>
      </Route> */}
      {/* QUản lý thông tin ks(Admin/ Owner) || có thể không cần dùng*/}
      <Route exact path={path.hotelProfile}>
        <HotelManagerGuard>
          <ProfileHotel />
        </HotelManagerGuard>
      </Route>
      {/* Đánh giá */}
      <Route exact path={path.overview}>
        <HotelManagerGuard>
          <Overview />
        </HotelManagerGuard>
      </Route>
      {/* Dashboard  */}
      <Route exact path={path.dashboard}>
        <HotelManagerGuard>
          <Dashboard />
        </HotelManagerGuard>
      </Route>
      <Route exact path={path.notFound}>
        <NotFound />
      </Route>
    </Switch>
  );
};

export default Routes;
