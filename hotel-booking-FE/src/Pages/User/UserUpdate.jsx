import { UserOutlined } from "@ant-design/icons";
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
    Radio,
    DatePicker,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import UploadImage from "../../common/UploadImage";
import DashboardLayout from "../../core/layout/Dashboard";
import dayjs from "dayjs";
import { useForm } from "antd/lib/form/Form";
import moment from "moment";

const UserUpdate = () => {
    const { user } = useSelector((state) => state.auth.profile);
    const role = (user?.role || "").toUpperCase(); // ADMIN, OWNER, USER
    const isAdmin = role === "ADMIN";
    const { userId } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const [userData, setUserData] = useState(user);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [avatar, setAvatar] = useState("");
    const [progress, setProgress] = useState(0);

    const isOwnProfile = String(user?.userId) === String(userId || user.userId);
    const canEdit = isAdmin || isOwnProfile;
    const fetchUserById = async (userId) => {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`http://localhost:8080/api/dashboard/admin/users/${userId}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Không lấy được dữ liệu người dùng");
        }
        return res.json();
    };
    const updateUser = async (userId) => {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`http://localhost:8080/api/dashboard/admin/users/${userId}/update`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            throw new Error("Không lấy được dữ liệu người dùng");
        }
        return res.json();
    };
    useEffect(() => {
        const loadUser = async () => {
            if (userId) {
                if (!isAdmin && !isOwnProfile) {
                    setError("Bạn không có quyền xem/sửa user này.");
                    return;
                }
                setLoading(true);
                try {
                    const data = await fetchUserById(userId);
                    console.log("user inf: ", data);

                    setUserData(data);
                } catch (e) {
                    setError(e.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setUserData(user);
            }
        };
        loadUser();
        
    }, [userId, user]);
    useEffect(() =>{
        if (userData) {
            form.setFieldsValue({
                username: userData?.username,
                fullname: userData?.fullname,
                phone: userData?.phone,
                gender: userData?.gender,
                roleName: userData?.roleName,
                birthday: userData?.birthday ? moment(userData.birthday) : null,

            });
        }
    }, [userData]);
    const onFinish = async (values) => {
        if (!canEdit) return;

        const _data = {
            ...values,
            userId: userData?.userId,
            urlImg: avatar?.url || userData?.urlImg,
            birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
        };
        try {
            const res = await updateUser(_data);
            unwrapResult(res);
            toast.success("Cập nhật thành công");

            if (userId) {
                const updated = await fetchUserById(userId);
                setUserData(updated);
            } else {
                history.go(0);
            }
        } catch (e) {
            console.error(e);
            toast.error("Cập nhật thất bại");
        }
    };

    // if (loading) return <LoadingUI />; //Tạo thêm giao diện loading
    // if (error) return <ErrorUI error={error} />; //Tạo giao diện raise lỗi
    // if (!userData) return <NotFoundUI />;

    return (
        <DashboardLayout>
            <div className="px-8 bg-white min-h-4/5 rounded">
                <Typography.Text className="inline-block font-bold text-3xl mt-6 mb-16">
                    {canEdit
                        ? "Chỉnh sửa thông tin người dùng"
                        : `Chi tiết người dùng: ${userData.fullname}`}
                </Typography.Text>

                <Form
                    form={form}
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                >
                    <Row>
                        <Col sm={18}>
                            <Form.Item
                                label="Tên tài khoản"
                                name="username">
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                label="Họ và tên"
                                name="fullname"
                                rules={[{ required: true }]}>
                                <Input disabled={!canEdit} />
                            </Form.Item>

                            <Form.Item label="Số điện thoại" name="phone" rules={[{ required: true }]}>
                                <Input disabled={!canEdit} />
                            </Form.Item>

                            <Form.Item label="Giới tính" name="gender">
                                <Radio.Group disabled={!canEdit}>
                                    <Radio value={true}>Nam</Radio>
                                    <Radio value={false}>Nữ</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item label="Ngày sinh" name="birthday">
                                <DatePicker disabled={!canEdit} />
                            </Form.Item>

                            {isAdmin && (
                                <Form.Item label="Vai trò" name="roleName">
                                    <Input disabled />
                                </Form.Item>
                            )}

                            <Form.Item label="Đổi mật khẩu (nếu cần)" name="password">
                                <Input.Password disabled={!canEdit} />
                            </Form.Item>
                        </Col>

                        <Col sm={6}>
                            <Avatar
                                className="ml-8 mt-12 border"
                                src={userData?.urlImg}
                                size={{ lg: 130, xl: 160 }}
                                icon={<UserOutlined />}
                            />
                            {canEdit && (
                                <Form.Item className="ml-16 mt-6">
                                    <UploadImage
                                        onChange={setAvatar}
                                        setProgress={setProgress}
                                        progress={progress}
                                    />
                                </Form.Item>
                            )}
                        </Col>
                    </Row>

                    {canEdit && (
                        <div className="flex justify-center my-10">
                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Cập nhật thông tin
                                </Button>
                            </Form.Item>
                        </div>
                    )}
                </Form>
            </div>
        </DashboardLayout>
    );
};

export default UserUpdate;
