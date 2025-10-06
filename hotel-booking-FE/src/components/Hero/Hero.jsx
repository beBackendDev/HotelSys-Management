import { Button, DatePicker, Form, InputNumber, Select } from "antd";
import qs from "query-string";
import { province } from "../../constant/province";
import { useHistory } from "react-router-dom";
import styles from "./styles.module.scss";
import { toast } from "react-toastify";
import axios from "axios";

const { Option, OptGroup } = Select;

const Hero = () => {
  const provinceData = province;
  const history = useHistory();

  const onFinish = async (values) => {
    try {
      const rangeValue = values["date"];
      const _val = {
        ...values,
        date: [
          rangeValue[0].format("YYYY-MM-DD"),
          rangeValue[1].format("YYYY-MM-DD"),
        ],
      };
      const _filters = {
        checkin_date: _val.date[0],
        checkout_date: _val.date[1],
        location: _val.province_name,
        type_room_id: _val.type_room_id,
        bed_quantity: _val.bed_quantity,
        page: 1,
      };
      // Gửi POST request
      const res = await axios.post("/api/user/public/hotels/filter", _filters);

      // Điều hướng đến trang kết quả và truyền data
      history.push({
        pathname: "/hotel/search",
        search: qs.stringify(_filters),
      });
    } catch (err) {
      console.error("Lỗi khi tìm kiếm khách sạn", err);
      toast.error("Đã xảy ra lỗi khi tìm kiếm khách sạn");
    }

  };

  const onFinishFailed = (errorInfo) => {
    toast.error("Vui lòng nhập thông tin");
  };

  return (
    <div className="max-w-screen">
      <div className={`py-12 px-4 
      ${styles.hero}
      `}  >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="font-extrabold text-white mb-6">
              <span className="text-[100px] uppercase block">Find</span>
              <span className="text-[50px] block border-b-4 border-white-500 inline-block">
                Your Dream Place To Stay
              </span>
            </h1>
            <p className="text-white mb-6">
              Explore our curated selection of exquisite properties meticulously tailored to your unique dream home vision
            </p>
            <Button type="primary" size="large" className="text-white border-none">
              Sign up
            </Button>
          </div>

          {/* Right Image */}
          <div className="mt-8 lg:mt-0 lg:ml-10">
            <img
              src="/images/hero_image.png"
              alt="Modern House"
              className="rounded-lg w-[90rem] h-auto"
            />
          </div>
        </div>

        {/* Search Form */}
        <div className="mt-0 flex justify-center">
          <Form
            name="basic"
            className={`${styles.form} bg-white p-6 rounded-lg shadow-xl`}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <Form.Item
                name="province_name"
                label={<span style={{ color: "black" }}>Địa điểm</span>}
                rules={[{ required: true }]}
              >
                <Select placeholder="Địa điểm" style={{ width: "180px" }}>
                  {provinceData.map((province) => (
                    <Option value={province.name} key={province.id}>
                      {province.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="date"
                label={<span style={{ color: "black" }}>Ngày đến | Ngày đi</span>}
                rules={[{ required: true }]}
              >
                <DatePicker.RangePicker format="YYYY-MM-DD" />
              </Form.Item>


              <Form.Item
                name="guestCount"
                label={<span style={{ color: "black" }}>Số lượng khách</span>}
                rules={[{ required: true, message: "Vui lòng nhập số lượng khách" }]}
              >
                <InputNumber
                  min={1}
                  max={20}
                  placeholder="Nhập số lượng khách"
                  style={{ width: "100%" }}
                />
              </Form.Item>


              <Button
                type="primary"
                className="h-10 mt-6 bg-blue-500 hover:bg-blue-600 text-white"
                htmlType="submit"
              >
                Tìm kiếm
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>


  );
};

export default Hero;
