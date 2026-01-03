import { Button, DatePicker, Form, InputNumber, Select } from "antd";
import { province } from "../../constant/province";
import styles from "./styles.module.scss";
import { useHistory } from "react-router-dom";
import qs from "query-string";
import { FilterOutlined } from "@ant-design/icons";
import React from "react";

const { Option } = Select;

const Hero = ({ toggleFilter, showFilter, onFilterChange }) => {
  const provinceData = province;
  const history = useHistory();

  const onFinish = (values) => {
    const rangeValue = values["date"];
    const params = {
      checkin: rangeValue?.[0]?.format("YYYY-MM-DD"),
      checkout: rangeValue?.[1]?.format("YYYY-MM-DD"),
      hotelAddress: values.province_name,
      guestCount: values.guestCount,
    };

    // Điều hướng sang trang /search
    console.log("data sent: ", qs.stringify(params));


    history.push({
      pathname: "/hotel/search",
      search: qs.stringify(params),
    });
  };

  return (
    <div className="max-w-screen">
      <div className={`${styles.hero} py-12 px-4`}>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="max-w-xl">
            <h1 className="font-extrabold text-white mb-6">
              <span className="text-[100px] uppercase block">Find</span>
              <span className="text-[50px] block border-b-4 border-white inline-block">
                Your Dream Place To Stay
              </span>
            </h1>
            <p className="text-white mb-6">
              Explore our curated selection of hotels tailored to your next journey.
            </p>
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

        {/* 🔎 Search Form */}
        <div className="mt-8 flex justify-center">
          <Form
            name="filter-form"
            className={`${styles.form} bg-white p-6 rounded-lg shadow-xl`}
            onFinish={onFinish}
            autoComplete="off"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <Form.Item
                name="province_name"
                label={<span style={{ color: "black" }}>Địa điểm</span>}
                rules={[{ required: true, message: "Vui lòng chọn địa điểm" }]}
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
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
              >
                <DatePicker.RangePicker format="YYYY-MM-DD" />
              </Form.Item>

              <Form.Item
                name="guestCount"
                label={<span style={{ color: "black" }}>Số lượng khách</span>}
                rules={[{ required: true, message: "Nhập số lượng khách" }]}
              >
                <InputNumber min={1} max={20} placeholder="Số lượng khách" />
              </Form.Item>

              <Button
                type="primary"
                className="h-10 mt-6 bg-blue-500 hover:bg-blue-600 text-white"
                htmlType="submit"
                onFinish={onFinish}
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
