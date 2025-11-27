import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, Form, Input, Row, Checkbox, Card } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { rules } from "../constant/rules";
import { processPayment } from "../slices/payment.slice";

//Logo MoMo VNPay
import MoMoLogo from "../assets/images/momo_square_pinkbg.svg";
import VNPayLogo from "../assets/images/logoVNPay.webp";
import TTTTLogo from "../assets/images/money_16441126.webp";


const Payment = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const token = localStorage.getItem("accessToken");

  const [method, setMethod] = useState(null);

  const onFinish = async (values) => {
    const paymentData = {
      ...values,
      bookingId: Number(bookingId),
      method: method || "VNPAY",
    };
    console.log("data payment in:", paymentData);

    try {
      console.log("(Payment.jsx) data before sent: ", paymentData);

      // const res = await dispatch(processPayment(paymentData));
      const res = await fetch(`http://localhost:8080/api/user/VNPay/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData)
      })
      
      const result = await res.json();
      console.log("Payment.jsx) response payment: ", result);


      if (result?.url) {
        window.location.href = result?.url;
      } else {
        // Trường hợp thanh toán tại quầy (CASH) hoặc ví MoMo có confirm ngay
        if (result.paymentStatus === "SUCCESS") {
          toast.success("Thanh toán thành công!");
          history.push("/user/bookings");
        } else {
          toast.info("Đơn hàng đang chờ xử lý thanh toán.");
          history.push("/user/bookings");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Thanh toán thất bại, vui lòng thử lại.");
    }
  };

  // Các option phương thức thanh toán
  const paymentMethods = [
    { value: "VNPAY", label: "Thanh toán qua VNPay", logo: VNPayLogo },
    { value: "MOMO", label: "Thanh toán bằng ví MoMo", logo: MoMoLogo },
    { value: "CASH", label: "Thanh toán tại quầy", logo: TTTTLogo },
  ];

  return (
    <Content className="max-w-6xl mx-auto mt-8 px-4">
      <Row gutter={24}>
        {/* Cột trái: Thông tin đặt phòng */}
        <Col xs={24} md={10}>
          <Card
            title="Thông tin đặt phòng"
            bordered={false}
            className="shadow-md rounded-lg"
          >
            <p><strong>Mã đặt phòng:</strong> {bookingId}</p>
            <p><strong>Khách sạn:</strong> Khách sạn ABC</p>
            <p><strong>Phòng:</strong> Deluxe View Biển</p>
            <p><strong>Check-in:</strong> 12/09/2025</p>
            <p><strong>Check-out:</strong> 14/09/2025</p>
            <p className="text-lg font-bold mt-2 text-red-500">
              Tổng tiền: 3.500.000 VND
            </p>
          </Card>
        </Col>

        {/* Cột phải: Form thanh toán */}
        <Col xs={24} md={14}>
          <Card
            title="Thông tin thanh toán"
            bordered={false}
            className="shadow-md rounded-lg"
          >
            {/* Hidden bookingId */}
            <Form.Item name="bookingId" initialValue={Number(bookingId)} hidden>
              <Input type="hidden" />
            </Form.Item>
            <Form
              layout="vertical"
              name="paymentForm"
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={rules.name}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={rules.email}
              >
                <Input placeholder="Nhập email để nhận hóa đơn" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input placeholder="SĐT liên hệ" />
              </Form.Item>

              {/* Card style chọn phương thức */}
              <Form.Item
                label="Chọn phương thức thanh toán"
                required
              >
                <Row gutter={[16, 16]}>
                  {paymentMethods.map((item) => (
                    <Col xs={24} sm={8} key={item.value}>
                      <Card
                        hoverable
                        onClick={() => setMethod(item.value)}
                        className={`cursor-pointer text-center p-4 ${method === item.value ? "border-blue-500 shadow-md" : ""
                          }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <img src={item.logo} alt={item.label} className="h-12 object-contain" />
                          <div className="font-medium">{item.label}</div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
                {!method && (
                  <div className="text-red-500 text-sm mt-1">
                    Vui lòng chọn phương thức thanh toán
                  </div>
                )}
              </Form.Item>

              <Form.Item
                name="terms"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject("Bạn phải đồng ý điều khoản"),
                  },
                ]}
              >
                <Checkbox>
                  Tôi đồng ý với <a href="/terms">điều khoản và chính sách hoàn hủy</a>.
                </Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  disabled={!method} // disable nếu chưa chọn method
                >
                  Thanh toán ngay
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Payment;
