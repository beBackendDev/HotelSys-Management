import { FacebookFilled, InstagramFilled, MailOutlined, TwitterSquareFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import styles from "./style.module.scss";

const Footer = () => {
  return (
   <footer
  className={`${styles.footerWrapper} flex w-full px-8 py-6 justify-between items-center mx-auto py-8 border-t ${styles.footerWrapper}`}
>
  {/* Cột trái: Logo + mô tả */}
  <div className="flex flex-col">
    {/* Hàng 1: Logo + Tên website */}
    <div className="flex items-center mb-2">
      <div className="w-10 h-10 rounded-lg mr-3">
        <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
      </div>
      <span className="text-[25px] font-bold">QuiNhon | Travel</span>
    </div>

    {/* Hàng 2: Mô tả */}
    <p className="text-sm text-gray-600 leading-relaxed">
      Nền tảng đặt phòng khách sạn trực tuyến với nhiều lựa chọn tiện nghi và giá cả phù hợp cho mọi khách du lịch.
    </p>
  </div>

  {/* Cột phải: Liên hệ + social */}
  <div className="text-left md:text-right">
    <p className="text-base mb-2 font-semibold">Liên hệ:</p>
    <p className="text-sm flex items-center md:justify-end">
      <MailOutlined className="mr-2" /> support@hotelbooking.com
    </p>
    <div className="flex justify-start md:justify-end space-x-3 mt-3 text-2xl text-gray-600">
      <a href="https://facebook.com" target="_blank" rel="noreferrer">
        <FacebookFilled />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noreferrer">
        <InstagramFilled />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noreferrer">
        <TwitterSquareFilled />
      </a>
    </div>
  </div>
</footer>

  );
};

export default Footer;
