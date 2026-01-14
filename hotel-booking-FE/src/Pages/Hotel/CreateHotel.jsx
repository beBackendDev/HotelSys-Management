import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Typography,
  InputNumber,
  Divider,
  Alert,
  Card,
  Steps,
  Row,
  Col,
  Space,
  Checkbox,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import DashboardLayout from "../../core/layout/Dashboard";

const { TextArea } = Input;

const CreateHotel = () => {
  const [createdHotel, setCreatedHotel] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [customFacility, setCustomFacility] = useState("");
  const [extraFacilities, setExtraFacilities] = useState([]);

  const history = useHistory();
  const token = localStorage.getItem("accessToken");
  const decodedToken = JSON.parse(atob(token.split('.')[1]));
  // const role = decodedToken.role;//
  const ownerId = decodedToken.userId;
  const FACILITIES = [
    { icon: "WifiOutlined", name: "Wifi miễn phí" },
    { icon: "CarFilled", name: "Bãi đỗ xe miễn phí" },
    { icon: "BulbFilled", name: "Hồ bơi" },
    { icon: "BulbFilled", name: "Nhà hàng" },
    { icon: "BulbFilled", name: "Phòng gym" },
    { icon: "BulbFilled", name: "Spa & Massage" },
    { icon: "BulbFilled", name: "Lễ tân 24/7" },
    { icon: "BulbFilled", name: "Giặt sấy miễn phí" },
    { icon: "BulbFilled", name: "Sử dụng toàn bộ tiện ích" },
  ];
  /* =========================
     STEP 1: CREATE HOTEL
  ========================== */
  const onCreateHotel = async (values) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/dashboard/owner/${ownerId}/hotels/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      const contentType = res.headers.get("content-type");
      const data =
        contentType && contentType.includes("application/json")
          ? await res.json()
          : await res.text();

      if (!res.ok) {
        throw new Error(data?.message || data || "Create hotel failed");
      }

      setCreatedHotel(data);
      message.success("Tạo khách sạn thành công");
    } catch (err) {
      console.error(err);
      message.error(err.message || "Tạo khách sạn thất bại");
    }
  };

  /* =========================
     STEP 2: UPLOAD IMAGES
  ========================== */
  const uploadImages = async (fileList) => {
    if (!createdHotel?.hotelId) {
      message.error("Không tìm thấy khách sạn để upload ảnh");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files", file.originFileObj);
      });
      formData.append("hotel", createdHotel.hotelName);
      // ✅ DEBUG (rất quan trọng)
    for (let [k, v] of formData.entries()) {
        console.log(k, v);
    }
      const res = await fetch(
        `http://localhost:8080/api/dashboard/owner/hotel/${createdHotel.hotelId}/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
console.log("img response:",data);

      if (!res.ok) {
        throw new Error(data?.message || "Upload image failed");
      }

      message.success("Upload hình ảnh thành công");
      history.push("/dashboard/hotel-management");
    } catch (err) {
      console.error(err);
      message.error(err.message || "Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };
  return (
    <DashboardLayout>
      <main style={{ padding: 24 }}>
        {/* ===== Page Header ===== */}
        <Typography.Title level={2} style={{ marginBottom: 24 }}>
          Tạo mới khách sạn
        </Typography.Title>

        {/* ===== Step Indicator ===== */}
        <Card style={{ marginBottom: 24 }}>
          <Steps
            current={createdHotel ? 1 : 0}
            items={[
              {
                title: "Thông tin khách sạn",
                description: "Nhập thông tin cơ bản",
              },
              {
                title: "Upload hình ảnh",
                description: "Thêm hình ảnh khách sạn",
              },
            ]}
          />
        </Card>

        {/* ================= STEP 1 ================= */}
        {!createdHotel && (
          
          <Card
            bordered={false}
          >
            <Typography.Title level={5} className="mb-0">
                        Bước 1: Thông tin khách sạn
                      </Typography.Title>
            <Form
              layout="vertical"
              onFinish={onCreateHotel}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Tên khách sạn"
                    name="hotelName"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="VD: Sunrise Hotel" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="Giá trung bình (VNĐ)"
                    name="hotelAveragePrice"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      placeholder="500000"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    label="Địa chỉ"
                    name="hotelAddress"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="123 Nguyễn Huệ, Q1" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="Email liên hệ"
                    name="hotelContactMail"
                    rules={[
                      { required: true, type: "email" },
                    ]}
                  >
                    <Input placeholder="contact@hotel.com" />
                  </Form.Item>
                </Col>

                <Col span={12}>
                  <Form.Item
                    label="SĐT liên hệ"
                    name="hotelContactPhone"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="0909xxxxxx" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col span={24}>
                  <Form.Item
                    label="Mô tả khách sạn"
                    name="hotelDescription"
                  >
                    <TextArea
                      rows={4}
                      placeholder="Mô tả ngắn về khách sạn..."
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* ===== FACILITIES (STATIC) ===== */}
              <Form.Item label="Tiện ích khách sạn" required>
                {/* ===== Facilities có sẵn ===== */}
                <Form.Item name="hotelFacilities" noStyle>
                  <Checkbox.Group style={{ width: "100%" }}>
                    <Row>
                      {FACILITIES.map((f) => (
                        <Col span={12} key={f.id}>
                          <Checkbox value={f}>{f.name}</Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </Form.Item>

                <Divider style={{ margin: "12px 0" }} />

                {/* ===== Facilities nhập tay ===== */}
                <Space style={{ width: "100%" }}>
                  <Input
                    placeholder="Nhập tiện ích khác (VD: Khu vui chơi trẻ em)"
                    value={customFacility}
                    onChange={(e) => setCustomFacility(e.target.value)}
                  />
                  <Button
                    type="dashed"
                    onClick={() => {
                      if (!customFacility.trim()) return;

                      setExtraFacilities((prev) => [
                        ...prev,
                        { name: customFacility.trim() },
                      ]);
                      setCustomFacility("");
                    }}
                  >
                    Thêm
                  </Button>
                </Space>

                {/* Hiển thị facilities nhập tay */}
                {extraFacilities.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    {extraFacilities.map((f, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: "inline-block",
                          background: "#f0f0f0",
                          padding: "4px 8px",
                          borderRadius: 6,
                          marginRight: 8,
                          marginBottom: 8,
                        }}
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
              </Form.Item>

              <Divider />

              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                >
                  Tạo khách sạn
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}

        {/* ================= STEP 2 ================= */}
        {createdHotel && (
          <Card
            bordered={false}
          >
            <Typography.Title level={5} className="mb-0">
                        Bước 2: Upload hình ảnh
                      </Typography.Title>
            <Alert
              type="success"
              showIcon
              message="Tạo khách sạn thành công"
              description="Bạn có thể upload hình ảnh cho khách sạn ngay bây giờ"
              style={{ marginBottom: 24 }}
            />

            <Upload
              listType="picture-card"
              multiple
              beforeUpload={() => false}
              customRequest={({ onSuccess }) =>
                onSuccess("ok")
              }
              onChange={({ fileList }) =>
                uploadImages(fileList)
              }
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>
                  Upload
                </div>
              </div>
            </Upload>

            <Divider />

            <Space>
              <Button
                type="primary"
                onClick={() =>
                  history.push(
                    "/dashboard/hotel-management"
                  )
                }
                loading={uploading}
              >
                Hoàn tất
              </Button>

              <Button
                onClick={() =>
                  history.push(
                    "/dashboard/hotel-management"
                  )
                }
              >
                Bỏ qua
              </Button>
            </Space>
          </Card>
        )}
      </main>
    </DashboardLayout>
  );

};

export default CreateHotel;
