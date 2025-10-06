import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, message, InputNumber, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory, useParams } from 'react-router-dom';
import DashboardLayout from '../../core/layout/Dashboard';
import api from '../../api/api';

const { Option } = Select;

const CreateRoom = () => {
    const { hotelId: paramHotelId } = useParams();
    const [hotels, setHotels] = useState([]);
    const [imageUrls, setImageUrls] = useState([]);
    const [form] = Form.useForm();
    const history = useHistory();

    useEffect(() => {
        let mounted = true;

        const fetchHotels = async () => {
            try {
                if (paramHotelId) {
                    const res = await api.get(`/admin/hotels/${paramHotelId}`);
                    if (!mounted) return;
                    setHotels([res.data]);
                    form.setFieldsValue({ hotelId: res.data.hotelId }); // set lại giá trị sau khi có option
                } else {
                    const res = await api.get('/admin/hotels');
                    if (!mounted) return;
                    setHotels(Array.isArray(res.data) ? res.data : []);
                }
            } catch (err) {
                console.error('Error fetching hotels:', err);
                message.error('Không tải được danh sách khách sạn');
            }
        };

        fetchHotels();

        return () => {
            mounted = false;
        };
    }, [paramHotelId, form]);

    const handleUploadChange = (info) => {
        const urls = (info.fileList || [])
            .map((file) => file.response?.url || file.url)
            .filter(Boolean);
        setImageUrls(urls);
    };

    const onFinish = async (values) => {
        try {
            const payload = {
                ...values,
                hotelId: paramHotelId || values.hotelId,
                roomImageUrls: imageUrls || [],
            };
            await api.post(`/admin/hotels/${paramHotelId}/create-room`, payload);
            message.success('Tạo phòng thành công');
            history.push('/dashboard/hotel-management');
        } catch (err) {
            console.error('Error creating room:', err);
            message.error('Tạo phòng thất bại');
        }
    };

    return (
        <DashboardLayout>
            <main style={{ maxWidth: 800, margin: '0 auto' }}>
                <header>
                    <h1 className="font-bold text-3xl mt-6 mb-10">Tạo mới phòng</h1>
                </header>

                <section>
                    <Typography.Text className="sr-only">Form tạo mới phòng</Typography.Text>

                    <Form layout="vertical" onFinish={onFinish} form={form}>
                        <Form.Item
                            label="Tên phòng"
                            name="roomName"
                            rules={[{ required: true, message: 'Nhập tên phòng' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Loại phòng"
                            name="roomType"
                            rules={[{ required: true, message: 'Chọn loại phòng' }]}
                        >
                            <Select placeholder="Chọn loại phòng">
                                <Option value="SINGLE">Single</Option>
                                <Option value="DOUBLE">Double</Option>
                                <Option value="LUX">Luxury</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Sức chứa"
                            name="roomOccupancy"
                            rules={[{ required: true, message: 'Nhập số người tối đa' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} />
                        </Form.Item>

                        <Form.Item
                            label="Trạng thái phòng"
                            name="roomStatus"
                            rules={[{ required: true, message: 'Chọn trạng thái phòng' }]}
                        >
                            <Select placeholder="Chọn trạng thái">
                                <Option value="AVAILABLE">Có sẵn</Option>
                                <Option value="BOOKED">Đã đặt</Option>
                                <Option value="TEMP_HOLD">Đợi thanh toán</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Giá mỗi đêm"
                            name="roomPricePerNight"
                            rules={[{ required: true, message: 'Nhập giá phòng' }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                formatter={(value) => `${value} VND`}
                                parser={(value) => value.replace(/\s?VND/g, '')}
                            />
                        </Form.Item>
                        {/* Thực hiện chọn khách sạn nếu chúng ta thực hiện onClick ngay trong page khách sạn. Còn không thì cho phép lựa chọn  */}
                        <Form.Item
                            label="Khách sạn"
                            name="hotelId"
                            rules={[{ required: true, message: 'Chọn khách sạn' }]}
                        >
                            <Select
                                placeholder="Chọn khách sạn"
                                showSearch
                                optionFilterProp="children"
                                disabled={!!paramHotelId}
                            >
                                {hotels.map((hotel) => (
                                    <Option key={hotel.hotelId} value={hotel.hotelId}>
                                        {hotel.hotelName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Hình ảnh phòng">
                            <Upload
                                action="/api/upload"
                                listType="picture-card"
                                onChange={handleUploadChange}
                                multiple
                            >
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Tạo phòng
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </main>
        </DashboardLayout>
    );
};

export default CreateRoom;
