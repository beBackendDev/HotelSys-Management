import { useState } from "react";
import { EnvironmentOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import HomeLayout from "../core/layout/HomeLayout";
import ExploreBanner from "../assets/images/ExploreBanner.jpg"
import { Icons } from "react-toastify";
import Navbar from "../components/Navbar/Navbar";

const fallbackImage = "https://via.placeholder.com/1200x800?text=No+Image";
const iconName = "EnvironmentOutlined";
const DynamicIcon = Icons[iconName];
const quyNhonDestinations = [
  {
    id: 1,
    name: "Quy Nhơn",
    province: "Bình Định",
    slogan: "Thiên đường biển miền Trung",
    image: ExploreBanner,
    hotspots: [
      {
        x: "60%", y: "50%", label: "Eo Gió",
        image: "http://localhost:8080/uploads/CASA/hotels/102/casamarinaImage.jpeg",
        description: "Nơi ngắm hoàng hôn và gió biển tuyệt đẹp."
      },
      {
        x: "45%", y: "42%", label: "Kỳ Co",
        image: "http://localhost:8080/uploads/CASA/hotels/102/casamarinaImage.jpeg",
        description: "Bãi biển nước trong xanh, cát trắng mịn."
      },
      {
        x: "30%", y: "65%", label: "Ghềnh Ráng Tiên Sa",
        image: "http://localhost:8080/uploads/CASA/hotels/102/casamarinaImage.jpeg",
        description: "Nơi gắn liền với thi sĩ Hàn Mặc Tử."
      },
      {
        x: "70%", y: "35%", label: "Tháp Đôi",
        image: "http://localhost:8080/uploads/CASA/hotels/102/casamarinaImage.jpeg",
        description: "Kiến trúc Chăm độc đáo giữa lòng thành phố."
      },
    ],
  },
];

export default function Destinations() {
  const [current, setCurrent] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const destination = quyNhonDestinations[current];

  const handleHotspotClick = (spot) => {
    setActiveHotspot(spot);
  };

  const closePopup = () => {
    setActiveHotspot(null);
  };

  return (
    <HomeLayout>
      <div className="relative w-full h-screen">
        <AnimatePresence mode="wait">
          <motion.img
            key={destination.image}
            src={destination.image || fallbackImage}
            alt={destination.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onError={(e) => (e.target.src = fallbackImage)}
            className="w-full h-full object-cover absolute inset-0 brightness-75"
          />
        </AnimatePresence>

        {/* Nội dung bên trái */}
        <div className="absolute inset-0 flex flex-col justify-center px-10 text-white z-10">

          <motion.h1
            key={destination.name}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-[100px] font-bold text-white uppercase drop-shadow-lg"
          >
            {destination.name}
          </motion.h1>
          <p className="text-[20px] italic mt-4">{destination.slogan}</p>
          <p className="text-[18px] italic mt-2 text-base opacity-80">{destination.province}</p>
        </div>

        {/* Hotspots */}

        {destination.hotspots.map((spot, index) => (

          <motion.button
            key={index}
            onClick={() => handleHotspotClick(spot)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            className="absolute bg-white bg-opacity-90 text-black px-3 py-1 text-sm rounded-full shadow z-20 transition"
            style={{
              top: spot.y,
              left: spot.x,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex">
              <EnvironmentOutlined />
              {spot.label}
            </div>

          </motion.button>
        ))}

        {/* Popup khi click */}
        <AnimatePresence>
          {activeHotspot && (
            <motion.div
              className="absolute bg-white rounded-xl shadow-xl p-4 w-80 z-30"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                top: "20%",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <img
                src={activeHotspot.image || fallbackImage}
                alt={activeHotspot.label}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h2 className="text-lg font-bold mb-1">{activeHotspot.label}</h2>
              <p className="text-sm text-gray-700 mb-3">
                {activeHotspot.description}
              </p>
              <button
                onClick={closePopup}
                className="text-sm text-red-500 hover:underline"
              >
                Đóng
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Số thứ tự */}
        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 text-white text-4xl font-bold z-10 drop-shadow-lg">
          01
        </div>
      </div>
    </HomeLayout>
  );
}
