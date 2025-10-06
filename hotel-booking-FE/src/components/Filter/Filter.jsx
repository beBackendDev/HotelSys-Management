import { Button, Col, DatePicker, Form, InputNumber, Row, Select } from "antd";
import qs from "query-string"; import { FilterOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { province } from "../../constant/province";
import axios from "axios";
import styles from "./style.module.scss";

const { Option, OptGroup } = Select;

export default function Filter({ filters }) {
  const history = useHistory();

  const onFinish = async (values) => {
    try {
      const rangeValue = values["date"];
      const _val = {
        ...values
      };
      const _filters = {
        location: _val.province_name,
        type_room_id: _val.type_room_id,
        price: _val.price,
        rating: _val.rating,
        facility: _val.facility,
      };
      Object.entries(values).forEach(([key, value]) => {
        console.log("-->Thông tin:", `${key}: ${value}`);
      });

      // Gửi POST request
      await axios.post("/api/user/public/hotels/filter", _filters);

      // Điều hướng đến trang tìm kiếm kèm theo query string
      // history.push({
      //   pathname: "/hotel/search",
      //   search: qs.stringify(_filters),
      // });
    } catch (error) {
      console.error("Lỗi khi lọc dữ liệu từ Filter.jsx", error);
      toast.error("Đã xảy ra lỗi khi lọc khách sạn");
    }
  };

  const onFinishFailed = () => {
    toast.error("Vui lòng nhập thông tin đầy đủ");
  };

  return (
    <div className={styles.filterWrapper}>
      <div className="py-3 flex">
        <FilterOutlined />
        <span className="text-xl ml-2">Bộ lọc</span>
      </div>

      <Row>
        <Col span={24} className="m-auto items-center flex flex-col">
          <Form
            name="filter-form"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            {/*Khoảng cách đến điểm du lịch */}
            <div className="border-b-2">
              <Form.Item
                name="province_name"
              >
                <span className="text-lg">
                  Điểm đến:
                </span>
                <Select placeholder="Địa điểm" style={{ width: "100%" }}>
                  {province.map((province) => (
                    <Option value={province.name} key={province.id}>
                      {province.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            {/* Giá phòng */}
            <div className="border-b-2" >
              <Form.Item
                name="price"
                >
                <span className="text-lg">
                  Giá Phòng:
                </span>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    value="under500"
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span>&lt; 500.000đ/ đêm</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    value="500to1000"
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span>500.000đ - 1.000.000đ/ đêm</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="price"
                    value="over1000"
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span>&gt; 1.000.000đ/ đêm</span>
                </label>

              </Form.Item>
            </div>
            {/* Đánh Giá */}
            <div className="border-b-2" >
              <Form.Item
                name="rating"
              >
                <span className="text-lg">
                  Đánh giá:
                </span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value="1sao"
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span>1 sao</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value="2sao"
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span>2 sao</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value="3sao"
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span>3 sao</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value="4sao"
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span>4 sao</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value="5sao"
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span>5 sao</span>
                </label>
              </Form.Item>
            </div>
            {/* Tiện nghi */}
            <div className="border-b-2" >
              <Form.Item
                name = "facility"
              >
                <span className="text-lg">
                  Tiện nghi:
                </span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="facility"
                    value=""
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span>Tiện nghi 1</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="facility"
                    value=""
                    className="accent-blue-500 w-4 h-4"
                  />
                  <span>Tiện nghi 2</span>
                </label>
              </Form.Item>
            </div>

            <div className="grid justify-items-end">
              <Button type="primary" className="  my-8 h-10" htmlType="submit">
                Áp dụng
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}
