import {
  Button,
  Checkbox,
  Form,
  Select,
  InputNumber,
  Row,
  Col
} from "antd";
import {
  FilterOutlined,
  MenuFoldOutlined,
  StarFilled
} from "@ant-design/icons";
import styles from "./style.module.scss";
import { province } from "../../constant/province";
import qs from "query-string";
import { toast } from "react-toastify";
import {
  PRICE_RANGES,
  RATINGS,
  FACILITIES
} from "../../constant/filter.constant";

const { Option } = Select;

const Filter = ({ toggleFilter, onFilterChange }) => {
  const provinceData = province;

  const onFinish = (values) => {
    try {
      const filters = {
        hotelAddress: values.province_name,
        minPrice: values?.min,
        maxPrice: values?.max,
        ratingPoints: values.ratingPoints,
        hotelFacilities: values.hotelFacilities,
      };

      // remove empty
      Object.keys(filters).forEach((k) => {
        const v = filters[k];

        if (
          v === undefined ||
          v === null ||
          (typeof v === "string" && v.trim() === "") ||
          (Array.isArray(v) && v.length === 0)
        ) {
          delete filters[k];
        }
      });


      console.log("Filter params:", qs.stringify(filters));

      onFilterChange(filters);
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi lọc khách sạn");
    }
  };

  return (
    <div className={styles.filterWrapper}>
      {/* HEADER */}
      <div
        className="py-3 flex items-center justify-between cursor-pointer border-b"
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
        <Form layout="vertical" onFinish={onFinish}>
          {/* LOCATION */}
          <Form.Item name="province_name" label="Địa điểm">
            <Select placeholder="Địa điểm">
              {provinceData.map((p) => (
                <Option key={p.id} value={p.name}>
                  {p.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* PRICE RANGE */}
          <Form.Item label="Giá phòng (VNĐ)" name="priceRange">
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item name="min" noStyle>
                  <InputNumber
                    placeholder="Từ"
                    min={0}
                    step={50000}
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      value
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : ""
                    }
                    parser={(value) => value.replace(/,/g, "")}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="max" noStyle>
                  <InputNumber
                    placeholder="Đến"
                    min={0}
                    step={50000}
                    style={{ width: "100%" }}
                    formatter={(value) =>
                      value
                        ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : ""
                    }
                    parser={(value) => value.replace(/,/g, "")}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>



          {/* RATING */}
          <Form.Item name="ratingPoints" label="Đánh giá">
            <Checkbox.Group className="flex flex-col gap-2">
              {RATINGS.map((r) => (
                <Checkbox key={r.value} value={r.value}>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarFilled
                        key={i}
                        style={{
                          color: i < r.stars ? "gold" : "gray",
                        }}
                      />
                    ))}
                  </div>
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          {/* FACILITIES */}
          <Form.Item name="hotelFacilities" label="Tiện ích">
            <Checkbox.Group className="flex flex-col gap-2">
              {FACILITIES.map((f) => (
                <Checkbox key={f.code} value={f.code}>
                  {f.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full mt-4">
            Áp dụng
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Filter;
