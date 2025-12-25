import {
  FacebookFilled,
  InstagramFilled,
  MailOutlined,
  TwitterSquareFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import styles from "./style.module.scss";

const Footer = () => {
  return (
    <footer className={`${styles.footerWrapper} border-t`}>
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Logo + Description */}
        <div>
          <div className="flex items-center mb-3">
            <img
              src={Logo}
              alt="QuiNhon Travel"
              className="w-10 h-10 object-contain mr-3"
            />
            <span className="text-xl font-bold">QuiNhon | Travel</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Nền tảng đặt phòng khách sạn trực tuyến giúp bạn khám phá Quy Nhơn
            với nhiều lựa chọn tiện nghi và mức giá hợp lý.
          </p>
        </div>

        {/* Column 2: Khám phá */}
        <div>
          <h4 className="font-semibold mb-3">Khám phá</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/hotels" className="hover:text-primary">Khách sạn</Link></li>
            <li><Link to="/destinations" className="hover:text-primary">Điểm đến</Link></li>
            <li><Link to="/offers" className="hover:text-primary">Ưu đãi</Link></li>
          </ul>
        </div>

        {/* Column 3: Hỗ trợ */}
        <div>
          <h4 className="font-semibold mb-3">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/faq" className="hover:text-primary">Câu hỏi thường gặp</Link></li>
            <li><Link to="/terms" className="hover:text-primary">Điều khoản</Link></li>
            <li><Link to="/privacy" className="hover:text-primary">Chính sách bảo mật</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact + Social */}
        <div>
          <h4 className="font-semibold mb-3">Liên hệ</h4>
          <p className="text-sm text-gray-600 flex items-center mb-3">
            <MailOutlined className="mr-2" />
            support@quinhnontravel.com
          </p>

          <div className="flex space-x-4 text-2xl text-gray-600">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary">
              <FacebookFilled />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary">
              <InstagramFilled />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary">
              <TwitterSquareFilled />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} QuiNhon Travel. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
