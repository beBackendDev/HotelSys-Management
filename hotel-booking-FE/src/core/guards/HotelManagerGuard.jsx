import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";

const HotelManagerGuard = ({ children }) => {
  const isHotelManager = useSelector((state) => state.auth.profile.user.role);
  console.log(">>>hotelmanagerguard- user: ", isHotelManager)
  if (isHotelManager == "ADMIN") {
    toast.success("Chào mừng bạn quay trở lại");
    return <div>{children}</div>;
  } else if (isHotelManager == "OWNER") {
    toast.success("Chào mừng bạn quay trở lại");
    return <div>{children}</div>;
  }
  return <Redirect to="/" />;

};

export default HotelManagerGuard;
