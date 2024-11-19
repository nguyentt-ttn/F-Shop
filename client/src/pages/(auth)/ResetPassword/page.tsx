import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../../API";
import { LockOutlined } from '@ant-design/icons';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();  // Lấy token từ URL
  const navigate = useNavigate();  // Dùng useNavigate để điều hướng sau khi reset mật khẩu
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { newPassword: string }) => {
    setLoading(true);
    try {
      // Gửi yêu cầu đặt lại mật khẩu đến backend
      await api.post("/reset-password", {
        token,  // Token lấy từ URL
        newPassword: values.newPassword,  // Mật khẩu mới
      });

      notification.success({
        message: "Mật khẩu đã được đặt lại thành công",
        description: "Bạn có thể đăng nhập bằng mật khẩu mới.",
      });

      navigate("/sign-in");
    } catch (error:any) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-auth min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-4 slide-auth-animation">
        <h1 className="text-2xl font-bold text-center mb-2">Đặt lại mật khẩu</h1>
        <p className="text-gray-600 text-center mb-8">
          Nhập mật khẩu mới để cập nhật tài khoản của bạn.
        </p>
        <Form
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu mới"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full h-11 bg-[#4c7dfc] text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-6">
          <span className="text-gray-600">Quay lại </span>
          <Link to="/sign-in" className="text-[#4c7dfc] hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
