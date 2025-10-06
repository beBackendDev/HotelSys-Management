import { Col, Row } from "antd";
import React, { useEffect } from "react";
import CardItem from "../components/CardItem/CardItem";
import HotelSlider from "../components/Slider/Slider";
import Hero from "../components/Hero/Hero";
import HomeLayout from "../core/layout/HomeLayout";
import { useState } from "react";
import Footer from "../components/Footer/Footer";

const HomePage = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        //json-server --watch db.json --port 3001 to run fake API
        const response = await fetch("http://localhost:8080/api/user/public/hotels?pageNo=0&pageSize=26");//response from server
        const data = await response.json();//data get response from server
        console.log("(Homepage)API: ", data);
        setHotels(data.content);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu khách sạn:", error);
      }
    };

    fetchHotels(); // gọi API
  }, []); // [] để chỉ gọi một lần sau khi component được render

  return (
    <HomeLayout>
      <div className="overflow-hidden mx-auto min-h-screen pb-20">
        {/* banner */}
        <div
          className="site-layout-background"
          style={{ minHeight: 380 }}
        >
          <Hero />
        </div>
        <div className="mx-auto min-h-screen pb-20 max-w-6xl">
          <h1 className="mt-8 mb-2 text-4xl font-medium">
            Tưng bừng khai trương
          </h1>
          <HotelSlider />
          <h1 className="mt-8 mb-2 text-4xl font-medium">
            Các khách sạn phổ biến
          </h1>

          <Row gutter={[16, 16]}>
            {hotels.map((hotels, index) => (
              <Col xl={6} key={hotels.id || index}>
                <CardItem data={hotels} />
              </Col>
            ))}
          </Row>
        </div>

      </div>
      <Footer className="bg-[#fdf6f2]"/>
    </HomeLayout>

  );
};

export default HomePage;
