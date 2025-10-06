import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import DashboardLayout from '../../core/layout/Dashboard';
import api from '../../api/api';

const { TextArea } = Input;
const { Option } = Select;

const CreateHotel = () => {
  const [owners, setOwners] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const history = useHistory();

  useEffect(() => {
    let mounted = true;
    axios
      .get('/api/admin/owners')
      .then((res) => {
        if (!mounted) return;
        setOwners(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error('Error fetching owners:', err);
        message.error('Không tải được danh sách chủ sở hữu');
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleUploadChange = (info) => {
    const urls = (info.fileList || [])
      .map((file) => file.response?.url || file.url)
      .filter(Boolean);
    setImageUrls(urls);
  };

  const onFinish = async (values) => {
    try {
        console.log("values: ", values);
      await api.post('/admin/hotels/create', {
        ...values,
        hotelImageUrls: imageUrls || "",
      }
    );
      message.success('Tạo khách sạn thành công');
      history.push('/dashboard/hotel-management');
    } catch (err) {
      console.error('Error creating hotel:', err);
      message.error('Tạo khách sạn thất bại');
    }
  };

  return (
    <DashboardLayout>
      <main style={{ maxWidth: 800, margin: '0 auto' }}>
        <header>
          <h1 className="font-bold text-3xl mt-6 mb-10">
            Tạo mới khách sạn
          </h1>
        </header>

        <section aria-labelledby="create-hotel-form">
          <Typography.Text id="create-hotel-form" className="sr-only">
            Form tạo mới khách sạn
          </Typography.Text>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="Tên khách sạn"
              name="hotelName"
              rules={[{ required: true, message: 'Nhập tên khách sạn' }]}
            >
              <Input aria-required="true" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="hotelAddress"
              rules={[{ required: true, message: 'Nhập địa chỉ' }]}
            >
              <Input aria-required="true" />
            </Form.Item>

            <Form.Item label="Tiện ích" name="hotelFacility">
              <TextArea rows={2} placeholder="Ví dụ: Wifi miễn phí, Bể bơi..." />
            </Form.Item>

            <Form.Item
              label="Email liên hệ"
              name="hotelContactMail"
              rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ' }]}
            >
              <Input aria-required="true" type="email" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại liên hệ"
              name="hotelContactPhone"
              rules={[{ required: true, message: 'Nhập số điện thoại' }]}
            >
              <Input aria-required="true" type="tel" />
            </Form.Item>

            <Form.Item label="Mô tả" name="hotelDescription">
              <TextArea rows={4} />
            </Form.Item>

            {/* <Form.Item
              label="Chủ sở hữu (Owner)"
              name="ownerId"
              rules={[{ required: true, message: 'Chọn chủ sở hữu' }]}
            >
              <Select placeholder="Chọn Owner" showSearch optionFilterProp="children" aria-required="true">
                {owners.map((owner) => (
                  <Option key={owner.id ?? owner.ownerId} value={owner.id ?? owner.ownerId}>
                    {owner.name ?? owner.fullName ?? 'Không tên'}
                  </Option>
                ))}
              </Select>
            </Form.Item> */}

            <Form.Item label="Hình ảnh khách sạn">
              <Upload
                action="/api/upload"
                listType="picture-card"
                onChange={handleUploadChange}
                multiple
                aria-label="Tải lên hình ảnh khách sạn"
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Tạo khách sạn
              </Button>
            </Form.Item>
          </Form>
        </section>
      </main>
    </DashboardLayout>
  );
};

export default CreateHotel;
