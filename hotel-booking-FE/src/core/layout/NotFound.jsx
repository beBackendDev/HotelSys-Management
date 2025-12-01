import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "antd";
import { HomeOutlined, WarningOutlined } from "@ant-design/icons";

const NotFound = () => {
  const location = useLocation();

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
        <WarningOutlined style={{ fontSize: "50px", color: "#faad14" }} />
        <h1 style={{ marginTop: "20px", fontSize: "32px", fontWeight: "bold" }}>
          404 - Page Not Found
        </h1>
        <p style={{ fontSize: "16px", color: "#555", marginBottom: "10px" }}>
          The page you are looking for does not exist or has been moved.
        </p>

        {/* Hiển thị thông tin log lỗi */}
        <div
          style={{
            background: "#f8f8f8",
            borderRadius: "8px",
            padding: "15px",
            marginTop: "20px",
            textAlign: "left",
            fontFamily: "monospace",
            fontSize: "14px",
            color: "#d4380d",
            border: "1px solid #f0f0f0",
          }}
        >
          <strong>Error Log:</strong>
          <br />
          <span>Requested Path: </span>
          <code>{location.pathname}</code>
          <br />
          <span>Message: </span>
          <code>Resource not found on server</code>
        </div>

        <Button
          type="primary"
          icon={<HomeOutlined />}
          style={{ marginTop: "25px" }}
          href="/"
        >
          Go to Homepage
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
