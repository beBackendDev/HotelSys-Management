import { PictureOutlined } from "@ant-design/icons";
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
  Select,
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UploadImage from "../../common/UploadImage";
import DashboardLayout from "../../core/layout/Dashboard";
import { updateRoomById } from "../../slices/room.slice"; // bạn cần tạo slice này

const fetchRoomById = async (hotelId, roomId) => {
  const token = localStorage.getItem("accessToken");
  const res = await fetch(
    `http://localhost:8080/api/dashboard/admin/hotels/${hotelId}/rooms/${roomId}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Không lấy được dữ liệu phòng");
  }
  return res.json();
};

const RoomProfile = () => {
  const { hotelId, roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newImage, setNewImage] = useState("");
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const load = async () => {

      if (hotelId && roomId) {

        setLoading(true);
        try {
          const data = await fetchRoomById(hotelId, roomId);
          setRoom(data);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }
    };
    load();
  }, [hotelId, roomId]);

  const onFinish = async (values) => {
    const _data = {
      ...values,
      roomId: room?.roomId,
      hotelId: room?.hotelId,
      roomImageUrls: newImage ? [newImage.url] : room?.roomImageUrls,
    };
    //Cập nhật phòng
    try {
      const res = await dispatch(updateRoomById({hotelId, roomId, data: _data}));
      console.log("res: ", res);
      unwrapResult(res);
      toast.success("Cập nhật phòng thành công");
      const updated = await fetchRoomById(hotelId, roomId);
      setRoom(updated);
    } catch (e) {
      console.error(e);
      toast.error("Cập nhật thất bại");
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="px-8 bg-white min-h-4/5 rounded flex justify-center items-center" style={{ minHeight: "300px" }}>
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

  if (!room)
    return (
      <DashboardLayout>
        <div className="px-8 bg-white min-h-4/5 rounded p-6">
          <Typography.Text>Không tìm thấy phòng.</Typography.Text>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="px-8 bg-white min-h-4/5 rounded">
        <Typography.Text className="inline-block font-bold text-3xl mt-6 mb-16">
          Chỉnh sửa thông tin phòng
        </Typography.Text>
        <Form
          name="roomForm"
          initialValues={{
            roomName: room?.roomName,
            roomType: room?.roomType,
            roomOccupancy: room?.roomOccupancy,
            roomStatus: room?.roomStatus,
            roomPricePerNight: room?.roomPricePerNight,
          }}
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Row gutter={[16, 16]}>
            <Col sm={18}>
              <Form.Item label="Tên phòng" name="roomName" rules={[{ required: true, message: "Tên phòng không được bỏ trống" }]}>
                <Input />
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col sm={8}>
                  <Form.Item label="Loại phòng" name="roomType" rules={[{ required: true, message: "Loại phòng không được bỏ trống" }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col sm={8}>
                  <Form.Item label="Số người tối đa" name="roomOccupancy" rules={[{ required: true, message: "Sức chứa không được bỏ trống" }]}>
                    <InputNumber min={1} style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col sm={8}>
                  <Form.Item label="Trạng thái" name="roomStatus" rules={[{ required: true, message: "Chọn trạng thái phòng" }]}>
                    <Select>
                      <Select.Option value="AVAILABLE">AVAILABLE</Select.Option>
                      <Select.Option value="OCCUPIED">OCCUPIED</Select.Option>
                      <Select.Option value="MAINTENANCE">MAINTENANCE</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col sm={12}>
                  <Form.Item label="Giá / đêm" name="roomPricePerNight" rules={[{ required: true, message: "Giá phòng không được bỏ trống" }]}>
                    <InputNumber
                      min={0}
                      style={{ width: "100%" }}
                      formatter={(value) => `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      parser={(value) => value.replace(/\s?VND|(,*)/g, "")}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col sm={6} className="flex flex-col items-center">
              <Avatar
                className="ml-8 mt-12 border border-orange-400"
                src={`http://localhost:8080${room?.roomImageUrls?.[0]}`}
                size={{ lg: 130, xl: 180, xxl: 200 }}
                icon={<PictureOutlined />}
              />
              <Form.Item className="ml-16 mt-6">
                <UploadImage onChange={setNewImage} setProgress={setProgress} progress={progress} />
              </Form.Item>
            </Col>
          </Row>

          {/* danh sách ảnh riêng một hàng */}
          {room?.roomImageUrls?.length > 0 && (
            <Row className="my-6">
              <Col span={24}>
                <Typography.Text className="font-semibold">Danh sách ảnh phòng:</Typography.Text>
                <div className="flex flex-wrap gap-4 mt-2">
                  {room.roomImageUrls.map((img, i) => (
                    <Avatar
                      key={i}
                      src={`http://localhost:8080${img}`}
                      size={100}
                      shape="square"
                      className="border"
                    />
                  ))}
                </div>
              </Col>
            </Row>
          )}

          <div className="flex justify-center my-10">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Cập nhật thông tin
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default RoomProfile;
