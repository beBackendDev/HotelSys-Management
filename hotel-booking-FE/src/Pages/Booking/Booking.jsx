import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, DatePicker, Form, Input, Row, Modal } from "antd";
import { formatDate, formatMoney } from "../../utils/helper";

import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useHistory,
  useLocation,
  useParams,
} from "react-router-dom";

import { toast } from "react-toastify";
import Filter from "../../components/Filter/Filter";
import LocalStorage from "../../constant/localStorage";
import { rules } from "../../constant/rules";
import HomeLayout from "../../core/layout/HomeLayout";
import { booking } from "../../slices/booking.slice";
import styles from "./styles.module.scss";
import moment from "moment";
import Footer from "../../components/Footer/Footer";

const Booking = () => {
  const { hotelId, roomId } = useParams();
  const token = localStorage.getItem("accessToken");
  const { user } = useSelector((state) => state.auth.profile);
  // Voucher state
  const [finalPrice, setFinalPrice] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [applyingVoucher, setApplyingVoucher] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);


  //thực hiện lấy thông tin thực của user đang thao tác với website
  const user_id = user.userId;
  const history = useHistory();
  const dispatch = useDispatch();
  //Hàm chặn người dùng chọn ngày checkin < today
  const disabledPreviousDates = (current) => {
    return current && current < moment().startOf("day");
  };
  //Hàm chặn người dùng chọn ngày checkout < checkin
  //


  const disableCheckoutDates = (current) => {
    if (!checkin) return current < moment().startOf("day");
    return current < moment(checkin, "YYYY-MM-DD").endOf("day");
  };
  const [room, setRoom] = useState(null);
  // State quản lý checkin/checkout
  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const { checkIn, checkOut } = location.state || {};
  const roomPricePerNight = 800000; // demo, sau này lấy từ API
  // Tính số đêm ở
  const nights =
    checkIn && checkOut
      ? moment(checkOut).diff(moment(checkIn), "days")
      : 0;

  const totalPrice = nights * room?.finalPrice;
  // Giá hiển thị cuối cùng sau khi áp dụng voucher (nếu có)
  const displayPrice = finalPrice !== null ? finalPrice : totalPrice;
  // Hàm định dạng ngày từ "YYYY-MM-DD" sang "DD-MM-YYYY"
  const formatDate = (dateStr) =>
    dateStr ? moment(dateStr, "YYYY-MM-DD").format("DD-MM-YYYY") : "";

  console.log("in out: ", checkIn, checkOut);

  // useEffect(() => {
  //   if (!checkIn || !checkOut) {
  //     Modal.warning({
  //       title: "Thiếu thông tin ngày",
  //       content: "Vui lòng quay lại trang khách sạn để chọn ngày.",
  //       onOk: () => history.goBack(),
  //     });
  //   }
  // }, [checkIn, checkOut]);

  console.log("state values: ", location);

  // Hàm xử lý áp dụng voucher
  const handleApplyVoucher = async () => {
    const voucherCode =
      document.querySelector("input[name='voucherCode']")?.value;
    console.log("voucher: ", voucherCode);

    if (!voucherCode) {
      toast.warning("Vui lòng nhập mã voucher");
      return;
    }

    if (!checkIn || !checkOut) {
      toast.warning("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }

    setApplyingVoucher(true);

    try {
      const res = await fetch(
        "http://localhost:8080/api/user/public/validate-voucher",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            voucherCode,
            roomId: Number(roomId),
            hotelId: Number(hotelId),
            checkIn,
            checkOut,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      const data = await res.json();

      setDiscountAmount(data.discountAmount);
      setFinalPrice(data.finalAmount);
      setAppliedVoucher(voucherCode);

      toast.success(
        `Áp dụng voucher thành công - Giảm ${formatMoney(
          data.discountAmount
        )}`
      );
    } catch (err) {
      setFinalPrice(null);
      setAppliedVoucher(null);
      setDiscountAmount(0);

      toast.error(err.message || "Voucher không hợp lệ");
    } finally {
      setApplyingVoucher(false);
    }
  };

  // Load checkin/out từ localStorage
  useEffect(() => {
    const filters = localStorage.getItem(LocalStorage.filters);
    if (filters) {
      const { checkin_date, checkout_date } = JSON.parse(filters);
      setCheckin(checkin_date);
      setCheckout(checkout_date);
    } else {
      // Nếu chưa có thì bật modal nhắc nhở
      setShowModal(true);
    }
  }, []);
  useEffect(() => {
    if (!roomId) return;

    fetch(`http://localhost:8080/api/user/public/hotels/${hotelId}/rooms/${roomId}`)
      .then(res => res.json())
      .then(data => {
        setRoom(data);
      })
      .catch(() => {
        toast.error("Không tìm thấy thông tin phòng");
        history.goBack();
      });
  }, [roomId]);
  console.log("room data:", room);

  const onFinish = async (values) => {
    // Validate lại: checkin/checkout bắt buộc
    if (!checkIn || !checkOut) {
      toast.error("Vui lòng chọn ngày nhận/trả phòng trước khi đặt!");
      return;
    }


    const birthday = values["birthday"];
    // const formattedBirthday = birthday ? birthday.format("YYYY-MM-DD") : null;
    const _val = {
      ...values,
      checkinDate: checkIn,
      checkoutDate: checkOut,
      voucherCode: appliedVoucher,
      // user_id,
      hotelId: Number(hotelId),
      roomId: Number(roomId),
    };
    console.log("input res:", _val);

    try {
      const res = await fetch(`http://localhost:8080/api/user/hotels/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(_val),
      });

      // Nếu HTTP status là lỗi → ném lỗi ngay
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Đã xảy ra lỗi không xác định");
      }

      const result = await res.json();
      console.log("booking res:", result);

      const bookingId = result?.bookingId;
      history.push(`/payment/${bookingId}`);

      toast.success("Đăng ký giữ chỗ thành công, vui lòng thực hiện thanh toán.");

    } catch (error) {
      console.error("ERROR:", error);
      toast.error(error.message); // HIỂN THỊ LỖI ĐÚNG FORMAT
    }

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <HomeLayout>
      <Content className={styles.bookingWrapper}>
        <div className={styles.card}>
          {/* TITLE */}
          <div className={styles.title}>
            <h1>Hoàn tất thông tin để đặt phòng</h1>
          </div>

          {/* FORM */}
          <Form
            className={styles.form}
            name="bookingForm"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            initialValues={{
              checkinDate: checkin,
              checkoutDate: checkout,
            }}
          >
            {/* ================= THÔNG TIN NGƯỜI Ở ================= */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Thông tin người ở</div>

              <div className={styles.infoGroup}>
                <div className={styles.inlineRow}>
                  <Form.Item label="Phòng">
                    <Input value={room?.roomName || ""} disabled />
                  </Form.Item>

                  <Form.Item
                    label="Họ và tên người ở"
                    name="guestFullName"
                    rules={rules.name}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <div className={`${styles.inlineRow} mt-3`}>
                  <Form.Item
                    label="Số điện thoại người ở"
                    name="guestPhone"
                    rules={[
                      { required: true, message: "Số điện thoại không được bỏ trống" },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="CCCD/CMND người ở"
                    name="guestCccd"
                    rules={[
                      { required: true, message: "CMND/CCCD không được bỏ trống" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>

                <Form.Item
                  className="mt-3"
                  label="Email người ở"
                  name="guestEmail"
                  rules={rules.email}
                >
                  <Input />
                </Form.Item>
              </div>
            </div>

            {/* ================= THỜI GIAN LƯU TRÚ ================= */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Thời gian lưu trú</div>
              {checkIn && checkOut && (
                <p className={styles.dateBox}>
                  Ngày nhận: <b>{formatDate(checkIn)}</b> | Ngày trả: <b>{formatDate(checkOut)}</b>
                </p>
              )}
            </div>

            {/* ================= GIÁ & VOUCHER ================= */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>Thanh toán</div>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="Giá phòng">
                    <Input
                      className={styles.priceInput}
                      value={
                        nights > 0
                          ? `${formatMoney(displayPrice)} (${nights} đêm)`
                          : ""
                      }
                      disabled
                    />
                  </Form.Item>
                </Col>

                <Col span={10}>
                  <Form.Item label="Mã voucher">
                    <Input
                      name="voucherCode"
                      placeholder="Nhập mã giảm giá"
                      disabled={!!appliedVoucher}
                    />
                  </Form.Item>
                </Col>

                <Col span={6} className={styles.voucherRow}>
                  <Button
                    className="w-full"
                    type="primary"
                    loading={applyingVoucher}
                    onClick={handleApplyVoucher}
                    disabled={!!appliedVoucher}
                  >
                    Áp dụng
                  </Button>
                </Col>
              </Row>
            </div>

            {/* ================= SUBMIT ================= */}
            <div className={styles.submitWrapper}>
              <Button type="primary" htmlType="submit">
                Xác nhận đặt phòng
              </Button>
            </div>
          </Form>
        </div>
      </Content>

      {/* MODAL NHẮC CHỌN NGÀY */}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
      >
        <h2 className="text-xl font-bold mb-4">
          Vui lòng chọn ngày nhận/trả phòng
        </h2>
        <p className="mb-4 text-gray-600">
          Bạn cần chọn ngày check-in và check-out để hệ thống kiểm tra phòng trống.
        </p>
      </Modal>
      <Footer />
    </HomeLayout>
  );

};

export default Booking;
