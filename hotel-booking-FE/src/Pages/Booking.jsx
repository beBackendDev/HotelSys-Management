import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Col, DatePicker, Form, Input, Row, Modal } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useHistory,
  useParams,
} from "react-router-dom";

import { toast } from "react-toastify";
import Filter from "../components/Filter/Filter";
import LocalStorage from "../constant/localStorage";
import { rules } from "../constant/rules";
import HomeLayout from "../core/layout/HomeLayout";
import { booking } from "../slices/booking.slice";
import styles from "../styles/pages/login.module.scss";
import moment from "moment";

const Booking = () => {
  const { hotelId, roomId } = useParams();
  const token = localStorage.getItem("accessToken");
  const { user } = useSelector((state) => state.auth.profile);
  //thực hiện lấy thông tin thực của user đang thao tác với website
  const user_id = user.userId;
  const history = useHistory();
  const dispatch = useDispatch();
  //Hàm chặn người dùng chọn ngày checkin < today
  const disabledPreviousDates = (current) => {
    return current && current < moment().startOf("day");
  };
  //Hàm chặn người dùng chọn ngày checkout < checkin

  const disableCheckoutDates = (current) => {
    if (!checkin) return current < moment().startOf("day");
    return current < moment(checkin, "YYYY-MM-DD").endOf("day");
  };
  // State quản lý checkin/checkout
  const [checkin, setCheckin] = useState(null);
  const [checkout, setCheckout] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const onFinish = async (values) => {
    // Validate lại: checkin/checkout bắt buộc
    if (!checkin || !checkout) {
      toast.error("Vui lòng chọn ngày nhận/trả phòng trước khi đặt!");
      return;
    }

    const birthday = values["birthday"];
    // const formattedBirthday = birthday ? birthday.format("YYYY-MM-DD") : null;
    const _val = {
      ...values,
      checkinDate: checkin,
      checkoutDate: checkout,
      user_id,
      hotelId: Number(hotelId),
      roomId: Number(roomId),
    };

    try {
      // chuyển tiếp đến trang booking.slice.js
      //để thực hiện gọi API phía backend
      const res = await fetch(`http://localhost:8080/api/user/hotels/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(_val)
      })

      const result = await res.json();
      // const res = await dispatch(booking(_val));
      // unwrapResult(res);

      const bookingId = result?.payload?.data?.bookingId;
      //chuyển tiếp đến trang thanh toán sau khi thực hiện đăng kí thông tin booking
      history.push(`/payment/${bookingId}`);
      toast.success("Đăng ký giữ chỗ thành công, vui lòng thực hiện thanh toán.");

    } catch (error) {
      console.log(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <HomeLayout>
      <Content className="max-w-6xl mx-auto mt-5">
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Filter />
          </Col>
          <Col span={18}>
            <div className="bg-white">
              <div className={`${styles.formRegisterMemberContainer} flex-col`}>
                <h1 className="text-3xl font-bold mt-12">
                  Hoàn tất thông tin để đặt phòng
                </h1>
                <Form
                  className={styles.formRegisterMember}
                  name="bookingForm"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                  initialValues={{
                    checkinDate: checkin,
                    checkoutDate: checkout,
                  }}
                >
                  <Form.Item>
                    <div className={styles.formInputName}>
                      {/* Thông tin phòng */}
                      <Form.Item
                        label="Phòng"
                        name="roomId"
                        initialValue={roomId}
                        className="mr-4"
                      >
                        <Input disabled />
                      </Form.Item>
                      {/* Họ tên */}
                      <Form.Item
                        label="Họ và tên người ở"
                        name="guestFullName"
                        rules={rules.name}
                      >
                        <Input />
                      </Form.Item>
                    </div>

                    {/* Sđt + CCCD */}
                    <div className={`${styles.formInputName} mt-2`}>
                      <Form.Item
                        label="Số điện thoại người ở"
                        name="guestPhone"
                        rules={[
                          {
                            required: true,
                            message: "Số điện thoại không được bỏ trống",
                          },
                        ]}
                        className="mr-4"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="CCCD/CMND người ở"
                        name="guestCccd"
                        rules={[
                          {
                            required: true,
                            message: "CMND/CCCD không được bỏ trống",
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </div>
                  </Form.Item>

                  {/* Email */}
                  <Form.Item
                    label="Email người ở"
                    name="guestEmail"
                    rules={rules.email}
                  >
                    <Input />
                  </Form.Item>

                  {/* Nếu chưa có checkin/checkout thì render luôn input */}

                  <div className="flex gap-4">
                    <Form.Item
                      label="Ngày nhận phòng"
                      name="checkinDate"
                      rules={[
                        { required: true, message: "Vui lòng chọn ngày nhận phòng" },
                      ]}
                    >
                      <DatePicker
                        format="YYYY-MM-DD"
                        disabledDate={disabledPreviousDates}
                        onChange={(date, dateString) => setCheckin(dateString)}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Ngày trả phòng"
                      name="checkoutDate"
                      rules={[
                        { required: true, message: "Vui lòng chọn ngày trả phòng" },
                      ]}
                    >
                      <DatePicker
                        format="YYYY-MM-DD"
                        disabledDate={disableCheckoutDates}
                        onChange={(date, dateString) => setCheckout(dateString)}
                      />
                    </Form.Item>
                  </div>

                  {checkin && checkout && (
                    <p className="text-gray-600 mt-2">
                      Ngày nhận: <b>{checkin}</b> | Ngày trả: <b>{checkout}</b>
                    </p>
                  )}


                  <div className="flex justify-center my-10">
                    <Form.Item>
                      <Button type="primary" htmlType="submit">
                        Xác nhận đặt phòng
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>
          </Col>
        </Row>
      </Content>

      {/* Modal nhắc nhở nếu chưa có ngày in/out */}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
      >
        <h2 className="text-xl font-bold mb-4">Vui lòng chọn ngày nhận/trả phòng</h2>
        <p className="mb-4 text-gray-600">
          Bạn cần chọn ngày check-in và check-out để hệ thống kiểm tra phòng trống.
        </p>
      </Modal>
    </HomeLayout>
  );
};

export default Booking;
