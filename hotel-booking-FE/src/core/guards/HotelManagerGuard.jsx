import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";

const HotelManagerGuard = ({ children }) => {
  const isHotelManager = useSelector((state) => state.auth.profile.user.role);
  console.log(">>>hotelmanagerguard- user: ", isHotelManager)
  if (isHotelManager !== "ADMIN") {
    toast.error("Bạn không phải là chủ khách sạn");
    return <Redirect to="/" />;
  }
  return <div>{children}</div>;
};

export default HotelManagerGuard;
