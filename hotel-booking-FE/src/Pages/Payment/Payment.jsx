import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, Form, Input, Row, Checkbox, Card } from "antd";
import { Content } from "antd/lib/layout/layout";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { rules } from "../../constant/rules";
import { processPayment } from "../../slices/payment.slice";
import { formatDate, formatMoney } from "../../utils/helper";
import styles from "./styles.module.scss";

//Logo MoMo VNPay
import MoMoLogo from "../../assets/images/momo_square_pinkbg.svg";
import VNPayLogo from "../../assets/images/logoVNPay.webp";
import TTTTLogo from "../../assets/images/money_16441126.webp";
import HomeLayout from "../../core/layout/HomeLayout";
import Footer from "../../components/Footer/Footer";


const Payment = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const token = localStorage.getItem("accessToken");

  const [method, setMethod] = useState(null);
  const getPaymentMethod = (method) => {
    switch (method) {
      case "VNPAY":
        return `Mock-VNPay/create-payment?bookingId=${bookingId}`;
      case "MOMO":
        return "MOMO/create-payment";
      default:
        return "CASH/payment"; // USER or guest
    }
  };
  const onFinish = async (values) => {
    const paymentData = {
      ...values,
      bookingId: Number(bookingId),
      amount: 0,
      orderInfo: "thanh toan",
      method: method || "CASH",
    };

    try {

      // const res = await dispatch(processPayment(paymentData));
      const res = await fetch(`http://localhost:8080/api/user/${getPaymentMethod(method)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData)
      })

      const result = await res.json();
      console.log("retsult :", result );
      

      if (result?.paymentUrl) {
        window.location.href = result?.paymentUrl;
      } else {
        // Trường hợp thanh toán tại quầy (CASH) hoặc ví MoMo có confirm ngay
        toast.success("Thanh toán thành công!");
        history.push("/success-page");
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
  const fetchBookingDetails = async (bookingId) => {
    try {
      // const res = await dispatch(processPayment(paymentData));
      const res = await fetch(`http://localhost:8080/api/user/hotels/booking/${bookingId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      })
      const result = await res.json();
      console.log("booking(payment): ", result);

      setBooking(result);

    } catch (err) {
      console.error(err);
      toast.error("Thanh toán thất bại, vui lòng thử lại.");
    }
  };
  useEffect(() => {
    fetchBookingDetails(bookingId);
  }, [bookingId, token]);
  return (
    <HomeLayout>
      <Content className={styles.container}>
        <Row gutter={24}>
          {/* CỘT TRÁI: THÔNG TIN ĐẶT PHÒNG */}
          <Col xs={24} md={10}>
            <Card
              title="Thông tin đặt phòng"
              bordered={false}
              className={styles.card}
            >
              <div className={styles.bookingInfo}>
                <p>
                  <strong>Mã đặt phòng:</strong> {bookingId}
                </p>
                <p>
                  <strong>Khách sạn:</strong> {booking?.hotelName}
                </p>
                <p>
                  <strong>Phòng:</strong> {booking?.roomName}
                </p>
                <p>
                  <strong>Check-in:</strong>{" "}
                  {formatDate(booking?.checkinDate)}
                </p>
                <p>
                  <strong>Check-out:</strong>{" "}
                  {formatDate(booking?.checkoutDate)}
                </p>

                <div className={styles.totalPrice}>
                  Tổng tiền: {formatMoney(booking?.totalPriceAfterDiscount)} VND
                </div>
              </div>
            </Card>
          </Col>

          {/* CỘT PHẢI: FORM THANH TOÁN */}
          <Col xs={24} md={14}>
            <Card
              title="Thông tin thanh toán"
              bordered={false}
              className={styles.card}
            >
              <Form
                layout="vertical"
                name="paymentForm"
                onFinish={onFinish}
                autoComplete="off"
              >
                {/* hidden bookingId */}
                <Form.Item name="bookingId" initialValue={Number(bookingId)} hidden>
                  <Input />
                </Form.Item>

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
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                  ]}
                >
                  <Input placeholder="SĐT liên hệ" />
                </Form.Item>

                {/* CHỌN PHƯƠNG THỨC THANH TOÁN */}
                <Form.Item label="Chọn phương thức thanh toán" required>
                  <Row
                    gutter={[16, 16]}
                    className={styles.paymentMethods}
                  >
                    {paymentMethods.map((item) => (
                      <Col xs={24} sm={8} key={item.value}>
                        <Card
                          hoverable
                          onClick={() => setMethod(item.value)}
                          className={`${styles.methodCard} ${method === item.value ? styles.methodActive : ""
                            }`}
                        >
                          <div className={styles.methodContent}>
                            <img
                              src={item.logo}
                              alt={item.label}
                            />
                            <span>{item.label}</span>
                          </div>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                  {!method && (
                    <div className={styles.errorText}>
                      Vui lòng chọn phương thức thanh toán
                    </div>
                  )}
                </Form.Item>

                {/* ĐIỀU KHOẢN */}
                <Form.Item
                  name="terms"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                            "Bạn phải đồng ý điều khoản"
                          ),
                    },
                  ]}
                >
                  <Checkbox>
                    Tôi đồng ý với{" "}
                    <a href="/terms">
                      điều khoản và chính sách hoàn hủy
                    </a>
                    .
                  </Checkbox>
                </Form.Item>

                {/* SUBMIT */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    disabled={!method}
                    className={styles.submitBtn}
                  >
                    Thanh toán ngay
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer />
    </HomeLayout>
  );

};

export default Payment;
