class Path {
  constructor() {
    this.home = "/";
    this.destinations = "/destinations";
    this.searchHotel = "/hotel/search";
    this.register = "/register";
    this.login = "/login";
    this.registerMember = "/register-member";
    this.hotelDetail = "/hotel/:id";
    this.roomDetail = "/hotels/:hotelid/rooms/:roomid"; // Ví dụ: /rooms/123
    this.bookingDetail = "/hotels/:hotelId/rooms/:roomId/booking";
    this.payment = "/payment/:bookingId";

    this.dashboard = "/dashboard";
    this.overview = this.dashboard + "/overview";
    this.hotelProfile = this.dashboard + "/hotel-profile/:hotelId"; //Dùng Route Matching
    this.hotelProfileAdmin = (hotelId) => this.dashboard + `/hotel-profile/${hotelId}`; //Điều hướng trang( Navigate) chuyển sang trang chỉnh sửa hotel
    this.roomProfilePattern = this.dashboard + "/hotel/:hotelId/room-profile/:roomId"; //Dùng Route Matching
    this.roomProfileUrl = (hotelId, roomId) => this.dashboard + `/hotel/${hotelId}/room-profile/${roomId}`; //Điều hướng trang( Navigate)
    this.createHotel = this.dashboard + "/create-hotel";
    this.createRoom = (hotelId) => this.dashboard + `/${hotelId}/create-room`;
    this.hotelManagement = this.dashboard + "/hotel-management";
    this.roomManagement = this.dashboard + "/room-management";
    this.userManagement = this.dashboard + "/user-management";
    this.userDetailAdmin = this.dashboard + "/user/:userId";
    this.userUpdate = this.dashboard + "/user-update/:userId"; //Dùng Route Matching
    this.userUpdateAdmin = (userId) => this.dashboard + `/user-update/${userId}`; //Điều hướng trang( Navigate) chuyển sang trang chỉnh sửa user 

    this.hotelDetailAdmin = this.dashboard + "/hotel/:hotelId";

    this.roomDetailAdmin = this.dashboard + "/hotel/:hotelId/room/:roomId";  // pattern cho route

    // hàm build URL thật để navigate
    this.roomDetailAdminPath = (hotelId, roomId) => this.dashboard + `/hotel/${hotelId}/room/${roomId}`; // thực hiện sử dụng tham số hotelId để truyền vào path
    this.hotelDetailAdminPath = (hotelId) => this.dashboard + `/hotel/${hotelId}`; // thực hiện sử dụng tham số hotelId để truyền vào path
    this.userDetailAdminPath = (userId) => this.dashboard + `/user/${userId}`; // thực hiện sử dụng tham số userId để truyền vào path
    this.bookingManagement = this.dashboard + "/booking-management";
    this.bookingDetailAdmin = this.dashboard + "/booking-detail/:bookingId";
    this.paymentManagement = this.dashboard + "/payment-management";
    this.reviewManagement = this.dashboard + "/review-management";

    this.bookingDetailAdminPath = (bookingId) => this.dashboard + `/booking-detail/${bookingId}`; // thực hiện sử dụng tham số userId để truyền vào path
    this.paymentDetailAdmin = this.dashboard + "/payment-detail/:paymentId";
    this.paymentDetailAdminPath = (paymentId) => this.dashboard + `/payment-detail/${paymentId}`; // thực hiện sử dụng tham số userId để truyền vào path

    this.user = "/user";//Update user
    this.updateUser= this.user + "/update";//Change Password
    this.changePass = this.user + "/password";//Change Pword
    this.forgetPw = this.user + "forget-password";//forget Password
    this.purchase = this.user + "/purchase";//Purchase History
    this.reviewPage = this.user + "/review/:bookingId";// Review Page
    this.review = this.user + "/review";// Review History
    this.success = "/success-page";
    this.notFound = "*";

  }
}
export const path = new Path();
