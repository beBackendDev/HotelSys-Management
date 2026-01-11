import { Button, Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

const HotelDesc = ({ hotelInfo }) => {
  const defaultImage = "../assets/images/image.png";
 return (
    <div className={styles.card}>
      <div className={styles.cardInner}>
        {/* IMAGE */}
        <div className={styles.imageWrapper}>
          <img
            className={styles.image}
            src={
              hotelInfo?.hotelImageUrls?.[0]
                ? `http://localhost:8080${hotelInfo.hotelImageUrls[0]}`
                : defaultImage
            }
            alt={hotelInfo?.hotelName}
          />
        </div>

        {/* CONTENT */}
        <div className={styles.content}>
          <div className={styles.info}>
            <Typography.Text className={styles.hotelName}>
              {hotelInfo.hotelName}
            </Typography.Text>

            <Typography.Text className={styles.description}>
              {hotelInfo.hotelDescription}
            </Typography.Text>

            <span className={styles.address}>
              {hotelInfo.hotelAddress}
            </span>
          </div>

          {/* ACTION */}
          <div className={styles.action}>
            <Link to={`/hotel/${hotelInfo.hotelId}`}>
              <Button type="primary">Xem khách sạn</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDesc;
