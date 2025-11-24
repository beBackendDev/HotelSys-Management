//Khoong cần thiết
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
  Select,
} from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UploadImage from "../../common/UploadImage";
import RoomCardForManager from "../../components/RoomCardItem/RoomCardForManager";
import { rules } from "../../constant/rules";
import DashboardLayout from "../../core/layout/Dashboard";
import { createRoom, getRoomByHotelId } from "../../slices/room.slice";
import api from "../../api/api";

const RoomManagement = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [paginate, setPaginate] = useState({});
  const [banner, setBanner] = useState("");
  const [progress, setProgress] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const dispatch = useDispatch();
  const history = useHistory();
  const { hotelId } = useParams(); // Lấy hotelId từ URL

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const onFinish = async (values) => {
    const _data = {
      ...values,
      imageUrls:
        banner.url ||
        "https://res.cloudinary.com/dnykxuaax/image/upload/v1652715094/ibp9pfvutk5uhxmtgeyy.jpg",
      hotel_id: hotelId, // Dùng hotelId từ param
    };
    try {
      console.log("values: ", _data);
      await api.post(`/admin/hotels/${hotelId}/create-room`, {
        ..._data,
        roomImageUrls: imageUrls || "",
      }
      );
      message.success('Tạo khách sạn thành công');
      history.push('/dashboard/hotel-management');
    } catch (error) {
      console.error(error);
      toast.error("Tạo phòng thất bại");
    }
    handleCancel();
  };

  // useEffect(() => {
  //   const params = { hotel_id: hotelId, page: currPage };
  //   const _getRooms = async () => {
  //     const _data = await dispatch(getRoomByHotelId({ params }));
  //     const res = unwrapResult(_data);
  //     setPaginate(res.data);
  //     setRoomList(res.data.rooms);
  //   };
  //   _getRooms();
  // }, [currPage, dispatch, hotelId]);

  const onShowSizeChange = (curr) => {
    setCurrPage(curr);
  };

  return (
    <DashboardLayout>
      <Content className="max-w-6xl h-screen mx-auto mt-5">
        <div className="flex justify-between mb-5">
          <Button type="secondary" onClick={showModal}>
            Tạo phòng
          </Button>
          <Pagination
            simple
            current={currPage}
            total={
              paginate.totalPage * paginate.maxPageItem !== 0
                ? paginate.totalPage * paginate.maxPageItem
                : 1
            }
            onChange={onShowSizeChange}
          />
        </div>
        {roomList?.[0] &&
          roomList.map((room) => (
            <RoomCardForManager key={room.id} room={room} />
          ))}

        <Modal
          title="Tạo phòng"
          visible={isModalVisible}
          onCancel={handleCancel}
          destroyOnClose
          footer={null}
        >
          <Form
            name="create-room"
            onFinish={onFinish}
            autoComplete="off"
            initialValues={{ remember: true }}
          >
            <Form.Item label="Tên phòng" name="roomName" rules={rules.name}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Mô tả phòng"
              name="description"
              rules={[{ required: true, message: "Trường này không được bỏ trống" }]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Loại phòng"
              name="type_id"
              rules={[{ required: true, message: "Trường này không được bỏ trống" }]}
            >
              <Select placeholder="Loại phòng">
                <Select.Option value="1">Phòng VIP</Select.Option>
                <Select.Option value="2">Phòng thường</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Số giường"
              name="bed_quantity"
              rules={[{ required: true, message: "Trường này không được bỏ trống" }]}
            >
              <Select placeholder="Số giường">
                <Select.Option value="1">1 Giường</Select.Option>
                <Select.Option value="2">2 Giường</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Giá"
              name="price"
              rules={[
                { required: true, message: "Trường này không được bỏ trống" },
                { type: "number", min: 0, message: "Giá tiền phải lớn hơn 0" },
              ]}
            >
              <InputNumber prefix="VNĐ" className="w-full" />
            </Form.Item>

            <Form.Item>
              <UploadImage onChange={setBanner} setProgress={setProgress} progress={progress} />
            </Form.Item>

            <div className="flex justify-center mt-1 mb-0">
              <Form.Item>
                <Button type="primary" htmlType="submit" disabled={progress !== 100}>
                  Tạo phòng
                </Button>
              </Form.Item>
            </div>
          </Form>
        </Modal>
      </Content>
    </DashboardLayout>
  );
};

export default RoomManagement;
