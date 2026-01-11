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

  // Hero Component JSX - return block only
  return (
    <div className="max-w-screen">
      <div className={`${styles['hero-section']} py-16 px-4`}>
        <div className="max-w-7xl mx-auto">

          {/* Hero Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">

            {/* Left Content */}
            <div className={styles['hero-text']}>
              <h1 className="font-extrabold text-white mb-8 leading-tight">
                <span className="text-8xl md:text-9xl uppercase block mb-4 animate-fade-in">
                  Find
                </span>
                <span className="text-4xl md:text-5xl block border-b-4 border-white inline-block pb-2">
                  Your Dream Place To Stay
                </span>
              </h1>
              <p className="text-white text-lg md:text-xl mb-6 leading-relaxed opacity-90">
                Explore our curated selection of hotels tailored to your next journey.
              </p>
            </div>

            {/* Right Image */}
            <div className={styles['hero-image']}>
              <div className={styles['image-glow']}></div>
              <img
                src="/images/hero_image.png"
                alt="Modern House"
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition-all duration-500"
              />
            </div>
          </div>

          {/* Search Form */}
          <div className={`${styles['form-container']} mt-12 flex justify-center`}>
            <Form
              name="filter-form"
              className={`${styles['search-form']} bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-5xl`}
              onFinish={onFinish}
              autoComplete="off"
            >
              <div
                className={`${styles['form-grid']} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`}
              >
                {/* Location Field */}
                <Form.Item
                  className={`${styles['heroItem']}`}
                  name="province_name"
                  label={<span className={styles['form-label']}>📍 Địa điểm</span>}
                  rules={[{ required: true, message: "Vui lòng chọn địa điểm" }]}
                >
                  <Select placeholder="Chọn thành phố" size="large">
                    {provinceData.map((province) => (
                      <Option value={province.name} key={province.id}>
                        {province.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                {/* Date Range Field */}
                <Form.Item
                  className={`${styles['heroItem']} lg:col-span-2`}
                  name="date"
                  label={
                    <span className={styles['form-label']}>
                      📅 Ngày đến | Ngày đi
                    </span>
                  }
                  rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                >
                  <DatePicker.RangePicker
                    format="DD/MM/YYYY"
                    placeholder={["Ngày đến", "Ngày đi"]}
                    size="large"
                    className="w-full"
                  />
                </Form.Item>

                {/* Guest Count Field */}
                <Form.Item
                  className={`${styles['heroItem']}`}
                  name="guestCount"
                  label={<span className={styles['form-label']}>👥 Số khách</span>}
                  rules={[{ required: true, message: "Nhập số lượng khách" }]}
                >
                  <InputNumber
                    min={1}
                    max={20}
                    placeholder="1-20 khách"
                    size="large"
                    className="w-full"
                  />
                </Form.Item>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center mt-8">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className={`${styles['search-button']} bg-gradient-to-r from-blue-600 to-indigo-600 border-none text-white font-semibold px-12 h-12 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300`}
                >
                  🔍 Tìm kiếm khách sạn
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );

};

export default Hero;
