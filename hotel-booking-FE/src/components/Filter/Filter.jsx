import { Button, Col, Form, Radio, Row, Select } from "antd";
import { FilterOutlined, MenuFoldOutlined, StarFilled } from "@ant-design/icons";
import styles from "./style.module.scss";
import { province } from "../../constant/province";
import qs from "query-string";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import FormItem from "antd/lib/form/FormItem";
const { Option } = Select;

const Filter = ({ toggleFilter, showFilter, onFilterChange }) => {
  const provinceData = province;
  const history = useHistory();
  const onFinish = (values) => {
    try {
      const rangeValue = values["date"];
      const _val = {
        ...values
      };
      const _filters = {
        hotelAddress: _val.province_name,
        // type_room_id: _val.type_room_id,
        hotelAveragePrice: _val.price,
        ratingPoint: _val.ratingPoint,
        hotelFacilities: _val.hotelFacilities
      };


      // Điều hướng sang trang /search
      console.log("data sent(Filter.jsx): ", qs.stringify(_filters));

      onFilterChange(_filters);

    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lọc khách sạn");
    }
  };

  const onFinishFailed = () => {
    toast.error("Vui lòng nhập thông tin đầy đủ");
  };

  return (
    <div className={styles.filterWrapper}>
      {/* HEADER */}
      <div
        className="py-3 flex items-center justify-between cursor-pointer select-none border-b"
        onClick={toggleFilter}
      >
        <div className="flex items-center">
          <FilterOutlined />
          <span className="text-xl ml-2 font-semibold">Bộ lọc</span>
        </div>
        <MenuFoldOutlined />
      </div>

      {/* FORM */}
      <div className="p-4">
        <Form
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="province_name"
            label={<span style={{ color: "black" }}>Địa điểm</span>}

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
            name="price"
            label={<span className="text-lg font-medium">Giá phòng</span>}
          >
            <Radio.Group className="flex flex-col space-y-2">
              <Radio value="500000">&lt; 500.000đ / đêm</Radio>
              <Radio value="500to1000">500.000đ - 1.000.000đ</Radio>
              <Radio value="1000000">&gt; 1.000.000đ</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Rating */}
          <Form.Item
            name="ratingPoint"
            label={<span className="text-lg font-medium">Đánh giá</span>}
          >
            <Radio.Group className="flex flex-col space-y-2">
              <Radio value="5" >
                <div className="flex flex-row">
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gold" }} />
                </div>
              </Radio>
              <Radio value="4" >
                <div className="flex flex-row">
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gray" }} />
                </div>
              </Radio>
              <Radio value="3" >
                <div className="flex flex-row">
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gray" }} />
                  <StarFilled style={{ color: "gray" }} />
                </div>
              </Radio>
              <Radio value="2" >
                <div className="flex flex-row">
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gray" }} />
                  <StarFilled style={{ color: "gray" }} />
                  <StarFilled style={{ color: "gray" }} />
                </div>
              </Radio>
              <Radio value="0" >
                <div className="flex flex-row">
                  <StarFilled style={{ color: "gold" }} />
                  <StarFilled style={{ color: "gray" }} />
                  <StarFilled style={{ color: "gray" }} />
                  <StarFilled style={{ color: "gray" }} />
                  <StarFilled style={{ color: "gray" }} />
                </div>
              </Radio>
            </Radio.Group>


          </Form.Item>
          {/* Facilities */}
          <Form.Item
            name="hotelFacilities"
            label={<span className="text-lg font-medium">Tiện ích</span>}
          >
            <Radio.Group className="flex flex-col space-y-2">
              <Radio value="wifi">Truy cập miễn phí Wifi</Radio>
              <Radio value="Bãi giữ xe miễn phí">Bãi giữ xe miễn phí</Radio>
              <Radio value={"100"}>facility of hotel id 100</Radio>
              <Radio value="">Ban công rộng rãi</Radio>
            </Radio.Group>

          </Form.Item>

          <Button
            type="primary"
            className="w-full mt-4"
            htmlType="submit"
          >
            Áp dụng
          </Button>
        </Form>
      </div>
    </div>
  );
};
export default Filter;