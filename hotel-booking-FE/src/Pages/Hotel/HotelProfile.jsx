import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
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
  Checkbox,
  Tag,
  message,
  Select,
  Upload,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  CameraOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DashboardLayout from "../../core/layout/Dashboard";
import { updateProfileHotel } from "../../slices/hotel.slice";
import { rules } from "../../constant/rules";
import { Option } from "antd/lib/mentions";

const { TextArea } = Input;

const HotelProfile = () => {
  const { hotelId } = useParams();
  const history = useHistory();
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const token = localStorage.getItem("accessToken");
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const role = (decodedToken?.role || "").toUpperCase();
  const userId = decodedToken?.userId;

  const { user } = useSelector((state) => state.auth?.profile || {});

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [fileList, setFileList] = useState([]);

  // Mock facilities data
  const AVAILABLE_FACILITIES = [
    { icon: "BulbFilled", name: "WiFi miễn phí" },
    { icon: "BulbFilled", name: "Bãi đỗ xe miễn phí" },
    { icon: "BulbFilled", name: "Hồ bơi" },
    { icon: "BulbFilled", name: "Nhà hàng" },
    { icon: "BulbFilled", name: "Phòng gym" },
    { icon: "BulbFilled", name: "Spa & Massage" },
    { icon: "BulbFilled", name: "Lễ tân 24/7" },
    { icon: "BulbFilled", name: "Giặt sấy miễn phí" },
  ];

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
     STEP 2: UPLOAD IMAGES
  ========================== */
  const uploadImages = async (fileList) => {

    setUploading(true);
    try {
      const formData = new FormData();
      fileList.forEach((file) => {
        formData.append("files", file.originFileObj);
      });
      formData.append("hotel", hotel.hotelName);

      const res = await fetch(
        `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotel/${hotel.hotelId}/upload-image`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      console.log("img response:", data);

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
  const canEdit = role === "ADMIN" || role === "OWNER";

  // Fetch hotel data
  const fetchHotelById = async () => {
    if (!hotelId) {
      setError("Không tìm thấy khách sạn");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${hotelId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Không lấy được dữ liệu khách sạn");

      const data = await res.json();
      setHotel(data);
      setPreviewImages(data.hotelImageUrls || []);

      // Set selected facilities
      const facilityIds = data.hotelFacilities?.map((f) => f.id) || [];
      setSelectedFacilities(facilityIds);

      // Set form values
      form.setFieldsValue({
        hotelName: data.hotelName,
        hotelAddress: data.hotelAddress,
        // hotelAveragePrice: data.hotelAveragePrice,
        hotelStatus: data.hotelStatus,
        hotelContactMail: data.hotelContactMail,
        hotelContactPhone: data.hotelContactPhone,
        hotelDescription: data.hotelDescription,
      });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelById();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotelId]);

  // Handle form submission
  const onFinish = async (values) => {
    if (!canEdit) {
      toast.error("Bạn không có quyền chỉnh sửa khách sạn này");
      return;
    }

    setSubmitting(true);
    try {
      const updateData = {
        hotelId: hotel.hotelId || [],
        hotelName: values.hotelName || [],
        hotelAddress: values.hotelAddress || [],
        // hotelAveragePrice: values.hotelAveragePrice|| [],
        hotelContactMail: values.hotelContactMail || [],
        hotelStatus: values.hotelStatus || [],
        hotelContactPhone: values.hotelContactPhone || [],
        hotelDescription: values.hotelDescription || [],
      };

      const response = await fetch(
        `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${hotel.hotelId}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Cập nhật thất bại");
      }

      const data = await response.json();

      toast.success("Cập nhật thông tin khách sạn thành công!");

      // Refresh data
      await fetchHotelById();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Cập nhật thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFacilityChange = (checkedValues) => {
    setSelectedFacilities(checkedValues);
  };

  const handleNavigateToImages = () => {
    history.push(`/dashboard/hotel-management/${hotelId}/upload-images`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ padding: 24, textAlign: "center" }}>
          <Spin tip="Đang tải thông tin khách sạn..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div style={{ padding: 24 }}>
          <Alert type="error" message="Lỗi" description={error} showIcon />
          <Button
            onClick={() => history.goBack()}
            style={{ marginTop: 16 }}
            icon={<ArrowLeftOutlined />}
          >
            Quay lại
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (!hotel) {
    return (
      <DashboardLayout>
        <div style={{ padding: 24 }}>
          <Alert
            type="warning"
            message="Không tìm thấy khách sạn"
            showIcon
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => history.goBack()}
            style={{ marginBottom: 16 }}
          >
            Quay lại
          </Button>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Chỉnh sửa thông tin khách sạn
          </Typography.Title>
          <Typography.Text type="secondary">
            {hotel.hotelName}
          </Typography.Text>
        </div>

        {/* Info Alert */}
        {role === "ADMIN" && (
          <Alert
            type="info"
            showIcon
            message="Quyền Admin"
            description={`Bạn đang chỉnh sửa khách sạn thuộc Owner ID: ${hotel.ownerId}`}
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Main Form Card */}
        <Card style={{ marginBottom: 24 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            disabled={!canEdit}
          >
            {/* Row 1: Hotel Name & Average Price */}
            <Row gutter={24}>
              <Col xs={24} sm={24} md={12}>
                <Form.Item
                  label="Tên khách sạn"
                  name="hotelName"
                // rules={rules.name || [{ required: true }]}
                >
                  <Input
                    placeholder="VD: Sunrise Hotel"
                    size="large"
                  />
                </Form.Item>
              </Col>
              {/* <Col xs={24} sm={24} md={6}>
                <Form.Item
                  label="Giá trung bình (VNĐ)"
                  name="hotelAveragePrice"
                  // rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="500000"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    size="large"
                  />
                </Form.Item>
              </Col> */}
              <Col xs={24} sm={24} md={6}>
                <Form.Item
                  label="Trạng thái"
                  name="hotelStatus"
                // rules={rules.name || [{ required: true }]}
                >
                  <Select
                    placeholder="Chọn trạng thái"
                    size="large"
                    allowClear
                  >
                    <Option value="ACTIVE">Hoạt động</Option>
                    <Option value="INACTIVE">Ngừng hoạt động</Option>
                    {/* <Option value="PENDING">Chờ duyệt</Option>
                    <Option value="BANNED">Chờ duyệt</Option> */}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Row 2: Address */}
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item
                  label="Địa chỉ"
                  name="hotelAddress"
                // rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input
                    placeholder="123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Row 3: Email & Phone */}
            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Email liên hệ"
                  name="hotelContactMail"
                  rules={[
                    // { required: true, message: "Vui lòng nhập email" },
                    { type: "email", message: "Email không hợp lệ" },
                  ]}
                >
                  <Input
                    placeholder="contact@hotel.com"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Số điện thoại liên hệ"
                  name="hotelContactPhone"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại" },
                  ]}
                >
                  <Input
                    placeholder="0909xxxxxx"
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* Row 4: Description */}
            <Row gutter={24}>
              <Col xs={24}>
                <Form.Item
                  label="Mô tả khách sạn"
                  name="hotelDescription"
                // rules={rules.textarea || []}
                >
                  <TextArea
                    rows={5}
                    placeholder="Mô tả chi tiết về khách sạn, các dịch vụ đặc biệt, điểm nổi bật..."
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider />



            <Divider />

            {/* Row 6: Images Section */}
            <Row gutter={24}>
              <Col xs={24}>
                <Card type="inner" style={{ backgroundColor: "#fafafa" }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <div>
                        <Typography.Text strong>Hình ảnh khách sạn</Typography.Text>
                        <Typography.Paragraph
                          type="secondary"
                          style={{ marginBottom: 8 }}
                        >
                          {previewImages.length} hình ảnh đã tải lên
                        </Typography.Paragraph>
                      </div>
                    </Col>
                    <Col>
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
                    </Col>
                  </Row>

                  {/* Preview Images */}
                  {previewImages.length > 0 && (
                    <Row gutter={[12, 12]} style={{ marginTop: 16 }}>
                      {previewImages.slice(0, 4).map((img, idx) => (
                        <Col key={idx} xs={12} sm={8} md={6}>
                          <div
                            style={{
                              position: "relative",
                              overflow: "hidden",
                              borderRadius: 8,
                              backgroundColor: "#f0f0f0",
                              paddingBottom: "100%",
                            }}
                          >
                            <img
                              src={`http://localhost:8080${img}`}
                              alt={`Hotel ${idx + 1}`}
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                        </Col>
                      ))}
                      {previewImages.length > 4 && (
                        <Col xs={12} sm={8} md={6}>
                          <div
                            style={{
                              position: "relative",
                              overflow: "hidden",
                              borderRadius: 8,
                              backgroundColor: "#f0f0f0",
                              paddingBottom: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography.Text type="secondary">
                              +{previewImages.length - 4} ảnh
                            </Typography.Text>
                          </div>
                        </Col>
                      )}
                    </Row>
                  )}

                  {previewImages.length === 0 && (
                    <Alert
                      type="warning"
                      message="Chưa có hình ảnh"
                      description="Vui lòng tải lên ít nhất 1 hình ảnh cho khách sạn"
                      style={{ marginTop: 12 }}
                    />
                  )}
                </Card>
              </Col>
            </Row>

            {/* Form Actions */}
            {canEdit && (
              <Row justify="center" style={{ marginTop: 32 }}>
                <Space>
                  <Button
                    size="large"
                    onClick={() => history.goBack()}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    htmlType="submit"
                    icon={<SaveOutlined />}
                    loading={submitting}
                  >
                    Cập nhật thông tin
                  </Button>
                </Space>
              </Row>
            )}
          </Form>
        </Card>

        {/* Additional Info Card */}
        <Card>
          <Typography.Title level={5}>Thông tin hệ thống</Typography.Title>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <div>
                <Typography.Text type="secondary">Ngày tạo:</Typography.Text>
                <Typography.Text style={{ display: "block", marginTop: 4 }}>
                  {new Date(hotel.hotelCreatedAt).toLocaleString("vi-VN")}
                </Typography.Text>
              </div>
            </Col>
            <Col xs={24} sm={12}>
              <div>
                <Typography.Text type="secondary">Ngày cập nhật:</Typography.Text>
                <Typography.Text style={{ display: "block", marginTop: 4 }}>
                  {new Date(hotel.hotelUpdatedAt).toLocaleString("vi-VN")}
                </Typography.Text>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HotelProfile;