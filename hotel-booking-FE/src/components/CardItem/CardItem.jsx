import { Card, Tooltip } from "antd";
import { EnvironmentOutlined, StarFilled, StarOutlined } from "@ant-design/icons";
import placeholder from "../../assets/images/building-placeholder.png";
import { Link } from "react-router-dom";
import { getRoomByHotelId, userGetRoomByHotelId } from "../../slices/room.slice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./style.module.scss";


const CardItem = ({ data }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Đang kiểm tra..."); // trạng thái mặc định
  const id = data?.hotelId;

  const facilitiesArr = data.hotelFacility
    ?.split(",")
    .map((f) => f.trim());
const statusClass = {
  "Còn phòng": styles.available,
  "Hết phòng": styles.unavailable,
  "Đang kiểm tra...": styles.checking,
  "Không xác định": styles.unknown,
}[status];


  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);      // sao đầy
    const hasHalfStar = rating % 1 >= 0.5;     // có nửa sao không

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Sao đầy
        stars.push(
          <StarFilled key={i} style={{ color: "gold" }} />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Nửa sao (dùng gradient)
        stars.push(
          <StarFilled
            key={i}
            style={{
              background: "linear-gradient(90deg, gold 50%, #d9d9d9 50%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />
        );
      } else {
        // Sao rỗng
        stars.push(
          <StarOutlined key={i} style={{ color: "#d9d9d9" }} />
        );
      }
    }

    return stars;
  };

  // Lấy danh sách phòng và xác định trạng thái
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await dispatch(userGetRoomByHotelId({ hotelId: id })).unwrap();
        console.log("Rooms- ", id, ": ", res);

        if (res && res.length > 0) {
          // check nếu có phòng nào AVAILABLE
          const hasAvailableRoom = res.some(
            (room) => room.roomStatus?.toUpperCase() === "AVAILABLE"
          );
          setStatus(hasAvailableRoom ? "Còn phòng" : "Hết phòng");
        } else {
          setStatus("Hết phòng");
        }
      } catch (err) {
        console.error("Error fetching rooms: ", err);
        setStatus("Không xác định");
      }
    };

    if (id) fetchRooms();
  }, [dispatch, id]);

  return (
<div className={styles.cardWrapper}>
  <Card
    hoverable
    className={styles.card}
    cover={
      <div className={styles.coverWrapper}>
        <img
          src={
            data?.hotelImageUrls?.[0]
              ? `http://localhost:8080${data.hotelImageUrls[0]}`
              : placeholder
          }
          alt={data?.hotelName || "Hotel Image"}
          className={styles.coverImage}
        />

        <div className={`${styles.statusBadge} ${statusClass}`}>
          {status}
        </div>
      </div>
    }
  >
    <div className={styles.content}>
      <Tooltip placement="bottom" title={data?.hotelName}>
        <span className={styles.hotelName}>
          {data?.hotelName}
        </span>
      </Tooltip>

      <div className={styles.address}>
        <EnvironmentOutlined />
        <span>{data?.hotelAddress}</span>
      </div>

      <div className={styles.rating}>
        {data?.ratingPoint >= 1 ? (
          <>
            <div>{renderStars(data.ratingPoint)}</div>
            <span className="italic">
              {data.ratingPoint} ({data.totalReview} lượt đánh giá)
            </span>
          </>
        ) : (
          <span className={styles.noRating}>
            Chưa có đánh giá nào
          </span>
        )}
      </div>
    </div>

    <div className={styles.footer}>
      <Link
        to={`/hotel/${data?.hotelId || "None"}`}
        className={styles.detailLink}
      >
        Xem chi tiết
      </Link>
    </div>
  </Card>
</div>

  );
};

export default CardItem;
