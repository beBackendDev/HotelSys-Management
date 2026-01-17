import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
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
    Card,
    Divider,
    Space,
    Tooltip,
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

    const updateUser = async (data) => {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(`http://localhost:8080/api/dashboard/admin/users/${data.userId}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error("Cập nhật người dùng thất bại");
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

    useEffect(() => {
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
            fullname: values.fullname,
            phone: values.phone,
            gender: values.gender !== undefined ? values.gender : null,
            birthday: values.birthday ? values.birthday.format("YYYY-MM-DD") : null,
            urlImg: avatar?.url || userData?.urlImg,
            userId: userData?.userId,
        };

        try {
            setLoading(true);
            const res = await updateUser(_data);
            toast.success("Cập nhật thành công");
            setUserData(res);
            form.setFieldsValue({
                fullname: res.fullname,
                phone: res.phone,
                gender: res.gender,
                birthday: res.birthday ? moment(res.birthday) : null,
            });
        } catch (e) {
            console.error(e);
            toast.error(e.message || "Cập nhật thất bại");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <DashboardLayout>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                <Spin size="large" />
            </div>
        </DashboardLayout>
    );

    if (error) return (
        <DashboardLayout>
            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px" }}>
                <Alert message="Lỗi" description={error} type="error" showIcon />
            </div>
        </DashboardLayout>
    );

    if (!userData) return null;

    return (
        <DashboardLayout>
            <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
                {/* Header Section */}
                <div
                    style={{
                        backgroundColor: "#fff",
                        padding: "24px",
                        marginBottom: "24px",
                        borderBottom: "1px solid #f0f0f0",
                    }}
                >
                    <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            type="text"
                            size="large"
                            onClick={() => history.goBack()}
                            style={{ marginBottom: 16 }}
                        >
                            Quay lại
                        </Button>
                        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: "#000" }}>
                            {canEdit
                                ? "Chỉnh sửa thông tin người dùng"
                                : `Chi tiết người dùng: ${userData.fullname}`}
                        </h1>
                        <p style={{ margin: "8px 0 0 0", fontSize: 14, color: "#666" }}>
                            {userData.fullname} • {userData.username}
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px 24px" }}>
                    <Card>
                        <Form
                            form={form}
                            onFinish={onFinish}
                            autoComplete="off"
                            layout="vertical"
                        >
                            <Row gutter={[32, 0]}>
                                {/* Left Column - Form Fields */}
                                <Col xs={24} lg={16}>
                                    <div style={{ paddingRight: 16 }}>
                                        <Typography.Title level={4} style={{ marginBottom: 24 }}>
                                            Thông tin cơ bản
                                        </Typography.Title>

                                        <Form.Item
                                            label="Tên tài khoản (Gmail)"
                                            name="username"
                                            rules={[{ required: true, message: "Vui lòng nhập tên tài khoản" }]}
                                        >
                                            <Input
                                                placeholder="Nhập tên tài khoản"
                                                disabled
                                                prefix={<UserOutlined />}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Họ và tên"
                                            name="fullname"
                                            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
                                        >
                                            <Input
                                                placeholder="Nhập họ và tên"
                                                disabled={!canEdit}
                                            />
                                        </Form.Item>

                                        <Row gutter={16}>
                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    label="Số điện thoại"
                                                    name="phone"
                                                    rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                                                >
                                                    <Input
                                                        placeholder="Nhập số điện thoại"
                                                        disabled={!canEdit}
                                                        prefix={<UserOutlined />}
                                                    />
                                                </Form.Item>
                                            </Col>

                                            <Col xs={24} sm={12}>
                                                <Form.Item
                                                    label="Giới tính"
                                                    name="gender"
                                                >
                                                    <Radio.Group disabled={!canEdit}>
                                                        <Radio value={true}>Nam</Radio>
                                                        <Radio value={false}>Nữ</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                        <Form.Item
                                            label="Ngày sinh"
                                            name="birthday"
                                        >
                                            <DatePicker
                                                style={{ width: "100%" }}
                                                disabled={!canEdit}
                                                format="DD/MM/YYYY"
                                            />
                                        </Form.Item>

                                        {isAdmin && (
                                            <Form.Item
                                                label="Vai trò"
                                                name="roleName"
                                            >
                                                <Input disabled placeholder="Vai trò" />
                                            </Form.Item>
                                        )}

                                        <Divider style={{ margin: "32px 0" }} />

                                        <Typography.Title level={4} style={{ marginBottom: 24 }}>
                                            Bảo mật
                                        </Typography.Title>

                                        <Form.Item
                                            label="Đổi mật khẩu (nếu cần)"
                                            name="password"
                                        >
                                            <Input.Password
                                                placeholder="Nhập mật khẩu mới"
                                                disabled={!canEdit}
                                            />
                                        </Form.Item>
                                    </div>
                                </Col>

                                {/* Right Column - Avatar */}
                                <Col xs={24} lg={8}>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            paddingLeft: 16,
                                        }}
                                    >
                                        <Typography.Title level={4} style={{ marginBottom: 24, textAlign: "center" }}>
                                            Ảnh đại diện
                                        </Typography.Title>

                                        <Avatar
                                            src={avatar?.url || userData?.urlImg}
                                            size={160}
                                            icon={<UserOutlined />}
                                            style={{
                                                backgroundColor: "#1890ff",
                                                border: "4px solid #f0f0f0",
                                                marginBottom: 24,
                                            }}
                                        />

                                        {canEdit && (
                                            <div style={{ width: "100%" }}>
                                                <UploadImage
                                                    onChange={setAvatar}
                                                    setProgress={setProgress}
                                                    progress={progress}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>

                            {/* Action Buttons */}
                            {canEdit && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: 12,
                                        marginTop: 32,
                                        paddingTop: 24,
                                        borderTop: "1px solid #f0f0f0",
                                    }}
                                >
                                    <Button size="large" onClick={() => history.goBack()}>
                                        Hủy
                                    </Button>
                                    <Button type="primary" size="large" htmlType="submit">
                                        Cập nhật thông tin
                                    </Button>
                                </div>
                            )}
                        </Form>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserUpdate;