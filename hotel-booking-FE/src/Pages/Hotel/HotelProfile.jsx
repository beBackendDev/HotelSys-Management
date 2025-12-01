import { UserOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Spin,
  Alert,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UploadImage from "../../common/UploadImage";
import { rules } from "../../constant/rules";
import DashboardLayout from "../../core/layout/Dashboard";
import { updateProfileHotel } from "../../slices/hotel.slice";
const token = localStorage.getItem("accessToken"); // hoặc chỗ bạn lưu
const decodedToken = JSON.parse(atob(token.split('.')[1])); // decode JWT
const role = decodedToken.role; // ADMIN, OWNER, USER
const getUrlByRole = (role) => {
  switch (role) {
    case "ADMIN":
      return "admin";
    case "OWNER":
      return "owner";
    default:
      return "user"; // USER or guest
  }
};
const fetchHotelById = async (hotelId) => {
  const res = await fetch(`http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${hotelId}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Không lấy được dữ liệu khách sạn");
  }
  return res.json();
};

const Profile = () => {
  const { user } = useSelector(
    (state) => state.auth.profile
  );
  console.log("user redux: ", user);

  const role = (user?.role || "").toUpperCase(); // "ADMIN" hoặc "OWNER"

  const isAdmin = role === "ADMIN" || role === "OWNER";
  const { hotelId } = useParams();
  const [loading, setLoading] = useState(false);
  const [hotel, setHotel] = useState([]);
  const [error, setError] = useState(null);
  const [banner, setBanner] = useState("");
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();

  const canEdit = isAdmin || role === "OWNER"; //check role để thực hện cập nhật thông tin



  useEffect(() => {
    const load = async () => {
      if (hotelId) {
        if (isAdmin || role === "OWNER") {
          setLoading(true);
          try {
            const data = await fetchHotelById(hotelId);
            console.log("hotel data: ", data);            
            setHotel(data);
          } catch (e) {
            setError(e.message);
          } finally {
            setLoading(false);
          }
        }
      } else {
        setError("Bạn không có quyền xem/sửa khách sạn này.");
        return;
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId]);

  const onFinish = async (values) => {
    if (!canEdit) return;
    const ownerId = user?.userId;
    const _data = {
      ...values,
      image: banner?.url,
      user_id: ownerId,
    };
    try {
      const res = await dispatch(updateProfileHotel(_data));
      unwrapResult(res);
      toast.success("Cập nhật thông tin thành công");
      // reload lại dữ liệu
      if (hotelId) {
        const updated = await fetchHotelById(hotelId);
        setHotel(updated);
      } else {
        history.go(0);
      }
    } catch (e) {
      console.error(e);
      toast.error("Cập nhật thất bại");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  if (loading)
    return (
      <DashboardLayout>
        <div
          className="px-8 bg-white min-h-4/5 rounded flex justify-center items-center"
          style={{ minHeight: "300px" }}
        >
          <Spin tip="Đang tải..." />
        </div>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <div className="px-8 bg-white min-h-4/5 rounded p-6">
          <Alert type="error" message={error} />
        </div>
      </DashboardLayout>
    );

  if (!hotel)
    return (
      <DashboardLayout>
        <div className="px-8 bg-white min-h-4/5 rounded p-6">
          <Typography.Text>Không tìm thấy khách sạn.</Typography.Text>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="px-8 bg-white min-h-4/5 rounded">
        {isAdmin && hotelId && (
          <div className="mb-4">
            <Alert
              type="info"
              message={`Bạn đang ${canEdit ? "chỉnh sửa" : "xem"} khách sạn "${hotel.hotelName
                }"${hotel.userId ? ` thuộc owner ID: ${hotel.userId}` : ""
                } với quyền Admin.`}
              showIcon
            />
          </div>
        )}
        <Typography.Text className="inline-block font-bold text-3xl mt-6 mb-16">
          {canEdit
            ? "Chỉnh sửa trang thông tin khách sạn"
            : `Chi tiết khách sạn: ${hotel.hotelName}`}
        </Typography.Text>
        <Form
          name="basic"
          initialValues={{
            hotelName: hotel?.hotelName,
            hotelEmail: hotel?.hotelContactMail,
            hotelPhone: hotel?.hotelContactPhone,
            hotelAddress: hotel?.hotelAddress,
            hotelDescription: hotel?.hotelDescription,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Row>
            <Col sm={18}>
              <Form.Item
                label="Tên Khách sạn"
                name="hotelName"
                rules={rules.name}
              >
                <Input disabled={!canEdit} />
              </Form.Item>
              <Row gutter={[16, 16]}>
                <Col sm={8}>
                  <Form.Item label="Email" name="hotelEmail" rules={rules.email}>
                    <Input disabled={!canEdit} />
                  </Form.Item>
                </Col>
                <Col sm={8}>
                  <Form.Item
                    label="Số điện thoại"
                    name="hotelPhone"
                    rules={[
                      {
                        required: true,
                        message: "Trường này không được bỏ trống",
                      },
                    ]}
                  >
                    <Input disabled={!canEdit} />
                  </Form.Item>
                </Col>
                <Col sm={8}>
                  <Form.Item
                    label="Địa chỉ"
                    name="hotelAddress"
                    rules={[
                      {
                        required: true,
                        message: "Trường này không được bỏ trống",
                      },
                    ]}
                  >
                    <Input disabled={!canEdit} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col sm={24}>
                  <Form.Item
                    label="Mô tả"
                    name="hotelDescription"
                    rules={rules.textarea}
                  >
                    <Input.TextArea
                      style={{ height: "150px" }}
                      disabled={!canEdit}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col sm={6}>
              <Avatar
                className="ml-8 mt-12 border border-orange-400"
                size={{ lg: 130, xl: 180, xxl: 200 }}
                src={
                  hotel?.hotelImageUrls?.lenth > 0
                  ? `http://localhost:8080${hotel.hotelImageUrls[0]}`
                  : null
                }
                icon={<UserOutlined />}
              />
              {canEdit && (
                <Form.Item className="ml-16 mt-6">
                  <UploadImage
                    onChange={setBanner}
                    setProgress={setProgress}
                    progress={progress}
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          {canEdit && (
            <div className="flex justify-center my-10">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </div>
          )}
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
