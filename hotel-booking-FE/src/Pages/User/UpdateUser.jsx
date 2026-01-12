import { unwrapResult } from "@reduxjs/toolkit";


import moment from "moment";
import Icon, {
  UserOutlined,//user inf
  IdcardOutlined,//llocation
  PhoneOutlined,//phone 
  SolutionOutlined,//gender

} from "@ant-design/icons";
import { Avatar, Col, Row, Typography, Descriptions, Divider, Button, Form, Input, Select, Upload, DatePicker, message } from "antd";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UploadImage from "../../common/UploadImage";
import avtHolder from "../../assets/images/img-placeholder.jpg"
import { rules } from "../../constant/rules";
import { updateMe } from "../../slices/auth.slice";
import { formatDate } from "../../utils/helper";
import User from "./User";
import { Link } from "react-router-dom";
const { Option } = Select;


const UpdateUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInf, setUser] = useState([]);
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  const userId = JSON.parse(user)?.userId;
  console.log(userId);

  useEffect(() => {
    // Fetch dữ liệu user khi load component
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await res.json();
        console.log("(UpdateUser)API-User:", data);
        setUser(data);
      } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
      }
    }
    fetchUser();


  }, [userId, token]);
  useEffect(() => {
    if (userInf) {
      const gender = userInf?.gender == true ? "Nam" : "Nữ";
      form.setFieldsValue({
        fullname: userInf?.fullname,
        phone: userInf?.phone,
        email: userInf?.email,
        birthday: userInf.birthday
          ? moment(userInf.birthday, "YYYY-MM-DD")
          : null,
        gender: gender,
      });
    }
  }, [userInf, form]);

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("files", file);

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/user/image/${userId}/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      message.success("Upload thành công!");
      console.log("Avatar URL:", data);

      onSuccess(data); // ✅ dùng data, không phải res.data
      return data;
    } catch (error) {
      console.error("Upload error:", error);
      message.error("Upload thất bại!");
      onError(error);
    } finally {
      setLoading(false);
    }
  };


  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        birthday: values.birthday
          ? values.birthday.format("YYYY-MM-DD")
          : null,
        gender: values.gender,
      };
      console.log("Payload gửi API:", payload);
      const res = await fetch(`http://localhost:8080/api/user/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        alert("Cập nhật thất bại!");

      }
      const data = await res.json();
      alert("Cập nhật thành công!");
      // cập nhật lại form với dữ liệu mới
      form.setFieldsValue({
        ...data,
        birthday: data.birthday ? moment(data.birthday, "YYYY-MM-DD") : null,
      });
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <User>
      <div className="pt-4 px-8 bg-white h-screen rounded">
        <span className="inline-block font-bold text-3xl">
          Chỉnh sửa thông tin
        </span>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="p-10"
        >
          <Form.Item
            label="Họ tên"
            name="fullname"
            rules={rules.fullname}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={rules.phonenumber}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="birthday"
          >
            <DatePicker format="DD-MM-YYYY" />
          </Form.Item>

          <Form.Item
            label="Hình ảnh đại diện"
            rules={[{ required: true }]}
          >

            <Upload
              name="file"
              customRequest={handleUpload}
              listType="picture"
              showUploadList={false}>
              <Button>
                <Icon type="upload" /> Click to upload
              </Button>
            </Upload>

          </Form.Item>

          <Form.Item label="Giới tính" name="gender">
            <Select
              options={[
                { value: true, label: "Nam" },
                { value: false, label: "Nữ" },
              ]}
            />
          </Form.Item>


          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </div>
    </User>

  );
};

export default UpdateUser;
