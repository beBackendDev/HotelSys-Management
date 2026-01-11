import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Form, Input, Typography } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { rules } from "../../constant/rules";
import { changePassword } from "../../slices/auth.slice";
import User from "./User";
const ChangePass = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth.profile);
  const onFinish = async (values) => {
    console.log("(ChangePass) Input data: ", values);

    delete values.confirm;
    const _data = {
      ...values,
      id: String(user.id),
    };
    try {
      console.log("(ChangePass) Input data: ", _data);

      const res = await dispatch(changePassword(_data));
      unwrapResult(res);
      toast.success("Cập nhập mật khẩu thành công");
      //Sau khi update new pw thì thực hiện logic logout và chuyển hướng tới trang login
      history.push("/");
    } catch (error) {
      if (error.status === 405) {
        setError(error.data.message);
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
return (
  <User>
    <div
      className="min-h-screen flex justify-center items-start bg-gray-100 pt-20"
    >
      <div
        className="bg-white rounded-xl shadow-lg px-10 py-8 w-full max-w-md"
      >
        {/* TITLE */}
        <Typography.Title
          level={3}
          style={{
            textAlign: "center",
            marginBottom: 32,
            fontWeight: 600,
          }}
        >
          Đổi mật khẩu
        </Typography.Title>

        {/* FORM */}
        <Form
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={rules.password}
            help={error || null}
          >
            <Input.Password
              placeholder="Nhập mật khẩu hiện tại"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("oldPassword") !== value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu mới trùng với mật khẩu cũ")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu mới"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Nhập lại mật khẩu mới"
              size="large"
            />
          </Form.Item>

          {/* SUBMIT */}
          <div className="flex justify-center mt-8">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full h-12 text-base font-semibold rounded-lg"
            >
              Đổi mật khẩu
            </Button>
          </div>
        </Form>
      </div>
    </div>
  </User>
);

};

export default ChangePass;
