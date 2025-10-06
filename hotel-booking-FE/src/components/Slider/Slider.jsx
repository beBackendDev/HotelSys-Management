import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import dayjs from "dayjs";      

import CardItem from "../CardItem/CardItem";
import styles from "../CardItem/style.module.scss";
const HotelSlider = () => {
  
  const [listEvent, setListEvent] = useState([]);
  useEffect(()=>{
    const fetchHotels = async () => {
      const res = await fetch("http://localhost:8080/api/user/public/hotels?pageNo=0&pageSize=26");
      const json = await res.json();
      setListEvent(json.content);  
    };
    fetchHotels();
  }, []);

  //lọc khách sạn mới được tạo <10 days
  const newHotels = listEvent.filter(
    (h) => dayjs().diff(dayjs(h.hotelCreatedAt), "day") < 10
  );
  const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
    ],
  };

  return (
    
    <Slider {...settings}>
      {newHotels?.map((hotel) => (
        <div key={hotel.hotelId}>
            <CardItem data={hotel} />
        </div>

      ))}
    </Slider>
  );
};

export default HotelSlider;
