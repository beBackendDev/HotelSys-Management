import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Spin,
  Alert,
  Typography,
  InputNumber,
  Divider,
  Space,
  Select,
  Upload,
  message,
  DatePicker,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import moment from "moment";

import DashboardLayout from "../../core/layout/Dashboard";

const { TextArea } = Input;
const { Option } = Select;
  const getUrlByRole = (role) => {
    switch (role) {
      case "ADMIN":
        return "admin";
      case "OWNER":
        return "owner";
      default:
        return "user";
    }
  };
/* =========================
   FETCH ROOM
========================= */
const fetchRoomById = async (hotelId, roomId, role, token) => {


  const res = await fetch(
    `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${hotelId}/rooms/${roomId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Không lấy được dữ liệu phòng");
  return res.json();
};

const RoomProfile = () => {
  const { hotelId, roomId } = useParams();
  const history = useHistory();
  const [form] = Form.useForm();

  const token = localStorage.getItem("accessToken");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const role = (decodedToken?.role || "").toUpperCase();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const canEdit = role === "ADMIN" || role === "OWNER";

  /* =========================
     LOAD ROOM
  ========================= */
  const loadRoom = async () => {
    setLoading(true);
    try {
      const data = await fetchRoomById(hotelId, roomId, role, token);
      setRoom(data);
      setPreviewImages(data.roomImageUrls || []);

      form.setFieldsValue({
        roomName: data.roomName,
        roomType: data.roomType,
        roomOccupancy: data.roomOccupancy,
        roomPricePerNight: data.roomPricePerNight,
        discountPercent: data.discountPercent,
        discountType: data.discountType,
        discountStart: data.discountStart
          ? moment(data.discountStart)
          : null,

        discountEnd: data.discountEnd
          ? moment(data.discountEnd)
          : null,
        roomStatus: data.roomStatus,
        roomDescription: data.roomDescription,
      });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  /* =========================
     UPDATE ROOM
  ========================= */
  const onFinish = async (values) => {
    if (!canEdit) {
      message.error("Bạn không có quyền chỉnh sửa phòng này");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${hotelId}/update-room/${roomId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...values,
            discountStart: values.discountStart
      ? values.discountStart.toISOString()
      : null,

    discountEnd: values.discountEnd
      ? values.discountEnd.toISOString()
      : null,
            roomId,
            hotelId,
          }),
        }
      );

      if (!res.ok) throw new Error("Cập nhật phòng thất bại");

      message.success("Cập nhật phòng thành công");
      await loadRoom();
    } catch (e) {
      message.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
     UPLOAD IMAGES
  ========================= */
  const uploadImages = async () => {
    if (fileList.length === 0) {
      message.warning("Vui lòng chọn ảnh");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      fileList.forEach((file) =>
        formData.append("files", file.originFileObj)
      );
        formData.append("hotel", room.hotelName);
        

      const res = await fetch(
        `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/room/${roomId}/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload ảnh thất bại");

      message.success("Upload ảnh thành công");
      setFileList([]);
      await loadRoom();
    } catch (e) {
      message.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  /* =========================
     RENDER STATES
  ========================= */
  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: 24, textAlign: "center" }}>
          <Spin tip="Đang tải thông tin phòng..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div style={{ padding: 24 }}>
          <Alert type="error" message={error} showIcon />
        </div>
      </DashboardLayout>
    );
  }

  if (!room) return null;

  /* =========================
     RENDER UI
  ========================= */
  return (
    <DashboardLayout>
      <div
        style={{
          padding: 24,
          background: "#f5f5f5",
          minHeight: "100vh",
        }}
      >

        {/* Header */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => history.goBack()}
          style={{ marginBottom: 16 }}
        >
          Quay lại
        </Button>

        <Typography.Title level={2}>
          Chỉnh sửa thông tin phòng
        </Typography.Title>

        {/* FORM */}
        <Card
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          }}
        >

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={!canEdit}
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} md={12}>
                <Form.Item label="Tên phòng" name="roomName">
                  <Input size="large" />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="Loại phòng" name="roomType">
                  <Input size="large" />
                </Form.Item>
              </Col>
            </Row>


            <Row gutter={[24, 16]}>
              <Col xs={24} md={8}>
                <Form.Item label="Sức chứa" name="roomOccupancy">
                  <InputNumber min={1} size="large" style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label="Giá / đêm (VND)" name="roomPricePerNight">
                  <InputNumber
                    min={0}
                    size="large"
                    style={{ width: "100%" }}
                    formatter={(v) =>
                      `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item label="Trạng thái" name="roomStatus">
                  <Select size="large">
                    <Option value="AVAILABLE">Còn trống</Option>
                    <Option value="BOOKED">Đã thuê</Option>
                    <Option value="TEMP_HOLD">Bảo trì</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[24, 16]}>
              {/* Giá / đêm */}
              <Col xs={24} md={6}>
                <Form.Item label="Giá / đêm (VND)" name="roomPricePerNight">
                  <InputNumber
                    min={0}
                    size="large"
                    style={{ width: "100%" }}
                    formatter={(v) =>
                      `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </Col>

              {/* Giá trị giảm */}
              <Col xs={24} md={4}>
                <Form.Item
                  label="Giá trị giảm (%)"
                  name="discountPercent"
                  dependencies={["discountType"]}
                  rules={[
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const type = getFieldValue("discountType");
                        if (!type) return Promise.resolve();
                        if (value == null)
                          return Promise.reject("Nhập giá trị giảm");
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  <InputNumber
                    min={0}
                    max={100}
                    size="large"
                    style={{ width: "100%" }}
                    placeholder="VD: 10"
                  />
                </Form.Item>
              </Col>

              {/* Loại giảm */}
              <Col xs={24} md={5}>
                <Form.Item label="Loại giảm giá" name="discountType">
                  <Select size="large" allowClear placeholder="Chọn loại">
                    <Option value="OWNER_PROMOTION">Chương trình mới</Option>
                    <Option value="FLASH_SALE">Deal chớp nhoáng</Option>
                    <Option value="VOUCHER">Voucher</Option>
                    <Option value="MEMBER">Ưu đãi thành viên</Option>
                    <Option value="NONE">Không có</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Bắt đầu */}
              <Col xs={24} md={4}>
                <Form.Item label="Bắt đầu" name="discountStart">
                  <DatePicker
                    showTime
                    size="large"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY HH:mm"
                  />
                </Form.Item>
              </Col>

              {/* Kết thúc */}
              <Col xs={24} md={5}>
                <Form.Item label="Kết thúc" name="discountEnd">
                  <DatePicker
                    showTime
                    size="large"
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY HH:mm"
                  />
                </Form.Item>
              </Col>
            </Row>



            <Divider />

            {/* IMAGES */}
            <Typography.Text strong>Hình ảnh phòng</Typography.Text>

            <Upload
              listType="picture-card"
              multiple
              beforeUpload={() => false}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Chọn ảnh</div>
              </div>
            </Upload>

            <Button
              type="primary"
              loading={uploading}
              onClick={() => uploadImages(fileList)}
            >
              Upload ảnh
            </Button>

            <Divider />

            {canEdit && (
              <Row justify="center">
                <Space>
                  <Button onClick={() => history.goBack()}>Hủy</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={submitting}
                  >
                    Cập nhật phòng
                  </Button>
                </Space>
              </Row>
            )}
          </Form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RoomProfile;
