import React from "react";
import { Button } from "antd";
import { HomeOutlined, CheckCircleOutlined } from "@ant-design/icons";

const SuccessPage = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <CheckCircleOutlined 
        style={{ 
            fontSize: "100px",
            color: "#52c41a" }} 
        />

        <h1
          style={{
            marginTop: "20px",
            fontSize: "30px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Thanh toán thành công!
        </h1>

        <p style={{ fontSize: "16px", color: "#555", marginTop: "10px" }}>
          Cảm ơn bạn đã thanh toán.  
          Đơn đặt phòng của bạn đã được xác nhận thành công.
        </p>

        <p style={{ fontSize: "14px", color: "#777", marginTop: "5px" }}>
          Vui lòng kiểm tra email của bạn để xem thông tin chi tiết.
        </p>

        <Button
          type="primary"
          icon={<HomeOutlined />}
          style={{ marginTop: "25px" }}
          href="/"
        >
          Quay về Trang chủ
        </Button>
      </div>
    </div>
  );
};

export default SuccessPage;
