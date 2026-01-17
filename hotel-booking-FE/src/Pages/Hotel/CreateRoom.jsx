import React, { useEffect, useState } from 'react';
import {
    Form,
    Input,
    Button,
    Select,
    Upload,
    message,
    InputNumber,
    Typography,
    Card,
    Steps,
    Row,
    Col,
    Space,
    Divider,
    Alert,
    Checkbox,
    DatePicker,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';
import DashboardLayout from '../../core/layout/Dashboard';
import api from '../../api/api';

const { Option } = Select;
const { TextArea } = Input;

const CreateRoom = () => {
    const { hotelId: paramHotelId } = useParams();
    const [hotels, setHotels] = useState([]);
    const [createdRoom, setCreatedRoom] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileList, setFileList] = useState([]);

    const [form] = Form.useForm();
    const history = useHistory();
    const token = localStorage.getItem("accessToken");
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const role = decodedToken.role;
    const ownerId = decodedToken?.userId;
    const [customFacility, setCustomFacility] = useState("");
    const [extraFacilities, setExtraFacilities] = useState([]);
    const FACILITIES = [
        { icon: "WifiOutlined", name: "Wifi miễn phí" },
        { icon: "BulbFilled", name: "Bãi đỗ xe miễn phí" },
        { icon: "BulbFilled", name: "Hồ bơi" },
        { icon: "BulbFilled", name: "Hệ thống an ninh cao" },
        { icon: "BulbFilled", name: "Trang bị đầy đủ tiện ích (máy sấy, tủ lạnh, ấm đun nước, bàn là...)" },
        { icon: "BulbFilled", name: "Spa & Massage" },
        { icon: "BulbFilled", name: "Lễ tân 24/7" },
        { icon: "BulbFilled", name: "Giặt sấy miễn phí" },
        { icon: "BulbFilled", name: "Sử dụng toàn bộ tiện ích" },
        { icon: "BulbFilled", name: "Dịch vụ vệ sinh phòng 24/7" },
        { icon: "BulbFilled", name: "Trang bị đầy đủ hệ thống điện và ổ cắm" },
        { icon: "BulbFilled", name: "Hệ thống nước nóng lạnh" },
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

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const res = await fetch(
                    `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${paramHotelId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const contentType = res.headers.get("content-type");
                const data = await res.json() || [];
                console.log("createrooom: ", data);

                if (!res.ok) {
                    throw new Error(data?.message || data || "Create hotel failed");
                }
                setHotels(data)

                message.success("Tạo khách sạn thành công");
            } catch (err) {
                console.error(err);
                message.error(err.message || "Tạo khách sạn thất bại");
            }
        };
        fetchHotels();
    }, [paramHotelId, form, role]);

    /* =========================
       STEP 1: CREATE ROOM
    ========================== */
    const onCreateRoom = async (values) => {
        try {
            const payload = {
                ...values,
                hotelId: paramHotelId || values.hotelId,
            };

            const res = await fetch(
                `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/hotels/${payload.hotelId}/create-room`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const contentType = res.headers.get("content-type");
            const data =
                contentType && contentType.includes("application/json")
                    ? await res.json()
                    : await res.text();

            if (!res.ok) {
                throw new Error(data?.message || data || "Tạo phòng thất bại");
            }

            setCreatedRoom(data);
            message.success("Tạo phòng thành công");
        } catch (err) {
            console.error(err);
            message.error(err.message || "Tạo phòng thất bại");
        }
    };

    /* =========================
       STEP 2: UPLOAD IMAGES
    ========================== */
    const uploadImages = async (fileList) => {
        if (!createdRoom?.roomId) {
            message.error("Không tìm thấy phòng để upload ảnh");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            fileList.forEach((file) => {
                formData.append("files", file.originFileObj);
            });
            formData.append("hotel", hotels?.hotelName);

            const res = await fetch(
                `http://localhost:8080/api/dashboard/${getUrlByRole(role)}/room/${createdRoom?.roomId}/upload-image`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                }
            );

            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData?.message || "Upload image failed");
            }

            message.success("Upload hình ảnh thành công");
            // history.push(`/dashboard/${getUrlByRole(role)}/hotels/${paramHotelId}`);
            history.goBack();
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
                    Tạo mới phòng
                </Typography.Title>

                {/* ===== Step Indicator ===== */}
                <Card style={{ marginBottom: 24 }}>
                    <Steps
                        current={createdRoom ? 1 : 0}
                        items={[
                            {
                                title: "Thông tin phòng",
                                description: "Nhập thông tin cơ bản",
                            },
                            {
                                title: "Upload hình ảnh",
                                description: "Thêm hình ảnh phòng",
                            },
                        ]}
                    />
                </Card>

                {/* ================= STEP 1 ================= */}
                {!createdRoom && (
                    <Card bordered={false}>
                        <Typography.Title level={5} className="mb-0">
                            Bước 1: Thông tin phòng
                        </Typography.Title>

                        <Form
                            layout="vertical"
                            onFinish={onCreateRoom}
                            form={form}
                            style={{ marginTop: 24 }}
                        >
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Tên phòng"
                                        name="roomName"
                                        rules={[{ required: true, message: "Nhập tên phòng" }]}
                                    >
                                        <Input placeholder="VD: Phòng Deluxe 101" />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Loại phòng"
                                        name="roomType"
                                        rules={[{ required: true, message: "Chọn loại phòng" }]}
                                    >
                                        <Select placeholder="Chọn loại phòng">
                                            <Option value="SINGLE">Single</Option>
                                            <Option value="DOUBLE">Double</Option>
                                            <Option value="SUITE">Suite</Option>
                                            <Option value="LUX">Luxury</Option>
                                            <Option value="FAMILY">Family</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Sức chứa (người)"
                                        name="roomOccupancy"
                                        rules={[{ required: true, message: "Nhập số người tối đa" }]}
                                    >
                                        <InputNumber
                                            min={1}
                                            max={10}
                                            style={{ width: "100%" }}
                                            placeholder="2"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label="Giá mỗi đêm (VNĐ)"
                                        name="roomPricePerNight"
                                        rules={[{ required: true, message: "Nhập giá phòng" }]}
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
                                <Col xs={24} sm={8}>
                                    <Form.Item
                                        label="Loại giảm giá"
                                        name="discountType"
                                    >
                                        <Select allowClear placeholder="Chọn loại giảm giá">
                                            <Option value="OWNER_PROMOTION">Chương trình mới</Option>
                                            <Option value="FLASH_SALE">DEAL chớp nhoáng</Option>
                                            <Option value="VOUCHER">Voucher khuyến mãi</Option>
                                            <Option value="MEMBER">Ưu đãi thành viên mới</Option>
                                            <Option value="NONE">không có</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <Form.Item
                                        label="Giá trị giảm"
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
                                            style={{ width: "100%" }}
                                            placeholder="VD: 10"
                                        />
                                    </Form.Item>
                                </Col>

                                <Col xs={24} sm={8}>
                                    <Form.Item
                                        label="Thời gian áp dụng"
                                        name="discountStart"
                                    >
                                        <DatePicker
                                            showTime
                                            style={{ width: "100%" }}
                                            format="DD/MM/YYYY HH:mm"
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        label="Thời gian áp dụng"
                                        name="discountEnd"
                                    >
                                        <DatePicker
                                            showTime
                                            style={{ width: "100%" }}
                                            format="DD/MM/YYYY HH:mm"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    {/* ===== FACILITIES (STATIC) ===== */}
                                    <Form.Item label="Tiện ích phòng" required>
                                        {/* ===== Facilities có sẵn ===== */}
                                        <Form.Item name="roomFacilities" noStyle>
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
                                </Col>

                                {!paramHotelId && (
                                    <Col xs={24} sm={12}>
                                        <Form.Item
                                            label="Khách sạn"
                                            name="hotelId"
                                            rules={[{ required: true, message: "Chọn khách sạn" }]}
                                        >
                                            <Select
                                                placeholder="Chọn khách sạn"
                                                showSearch
                                                optionFilterProp="children"
                                            >
                                                {hotels.map((hotel) => (
                                                    <Option key={hotel.hotelId} value={hotel.hotelId}>
                                                        {hotel.hotelName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                )}
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24}>
                                    <Form.Item
                                        label="Mô tả phòng"
                                        name="roomDescription"
                                    >
                                        <TextArea
                                            rows={4}
                                            placeholder="Mô tả chi tiết về phòng, tiện ích, đặc điểm..."
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Divider />

                            <Form.Item>
                                <Button type="primary" size="large" htmlType="submit">
                                    Tạo phòng
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                )}

                {/* ================= STEP 2 ================= */}
                {createdRoom && (
                    <Card bordered={false}>
                        <Typography.Title level={5} className="mb-0">
                            Bước 2: Upload hình ảnh
                        </Typography.Title>

                        <Alert
                            type="success"
                            showIcon
                            message="Tạo phòng thành công"
                            description="Bạn có thể upload hình ảnh cho phòng ngay bây giờ"
                            style={{ marginBottom: 24, marginTop: 24 }}
                        />
                        <Row align="middle">
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
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    loading={uploading}
                                    onClick={() => uploadImages(fileList)}
                                >
                                    Upload ảnh
                                </Button>
                            </Col>

                        </Row>



                        <Divider />

                        <Space>
                            <Button
                                type="primary"
                                onClick={() =>
                                    history.push(
                                        `/dashboard/${getUrlByRole(role)}/hotels/${paramHotelId}`
                                    )
                                }
                                loading={uploading}
                            >
                                Hoàn tất
                            </Button>

                            <Button
                                onClick={() =>
                                    history.push(
                                        `/dashboard/${getUrlByRole(role)}/hotels/${paramHotelId}`
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

export default CreateRoom;