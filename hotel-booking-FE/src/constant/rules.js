import { message } from "antd";
import { isEmail } from "../utils/helper";

export const rules = {
  fullname: [
    {
      required: true,
      message: "Trường này không được bỏ trống",
    },
    {
      max: 120,
      message: "Tên có độ dài tối đa 120 kí tự",
    },
  ],
  textarea: [
    {
      required: true,
      message: "Trường này không được bỏ trống",
    },
    {
      max: 1000,
      message: "Tên có độ dài tối đa 1000 kí tự",
    },
  ],
  // username: [
  //   {
  //     required: true,
  //     message: "Trường này không được bỏ trống",
  //   },
  //   {
  //     max: 12,
  //     message: "Username tối đa 12 kí tự",
  //   },
  // ],
  email: [
    { required: true, message: "Vui lòng nhập Email" },
    { pattern: isEmail(), message: "Vui lòng nhập đúng định dạng Email" },
  ],
  password: [
    {
      required: true,
      message: "Vui lòng nhập password",
    },
    {
      min: 5,
      max: 10,
      message: "Password từ 6 đến 10 kí tự",
    },
  ],
  phonenumber: [
    {
      required: true,
      message: "Vui lòng nhập số điện thoại người dùng",
    },
    {
      max: 10,
      message: "Số điện thoại có tối đa 10 kí tự",
    },
    {
      pattern: /^[0-9]+$/,
      message:"Số điện thoại không tồn tại kí tự chữ viết"
    }
  ],
};
