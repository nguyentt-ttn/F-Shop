import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import api from "../../../API"; // API client của bạn
import { Link } from "react-router-dom";
import { MailOutlined } from '@ant-design/icons';

const RequestPasswordReset: React.FC = () => {
  const [loading, setLoading] = useState(false); // Trạng thái khi gửi yêu cầu

  // Xử lý gửi yêu cầu đặt lại mật khẩu
  const handleSubmit = async (values: { email: string }) => {
    setLoading(true);
    try {
      const response = await api.post("/request-password-reset", { email: values.email });
      console.log("Response từ backend:", response);

  
      // Kiểm tra mã trạng thái HTTP
      if (response.status === 200) {
        notification.success({
          message: "Yêu cầu thành công",
          description: "Vui lòng kiểm tra email để đặt lại mật khẩu.",
        });
      } else {
        throw new Error(response.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
      }
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-auth min-h-screen flex items-center justify-center">
    <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-4 slide-auth-animation">
      <h1 className="text-2xl font-bold text-center mb-2">Forget Password</h1>
      <p className="text-gray-600 text-center mb-8">
        Nhập địa chỉ email của bạn để nhận liên kết đặt lại mật khẩu. Chúng tôi sẽ gửi
        email hướng dẫn nếu email đó tồn tại trong hệ thống.
      </p>
      <Form
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email!" },
            { type: "email", message: "Email không đúng định dạng!" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Nhập email của bạn"
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
            Gửi yêu cầu
          </Button>
        </Form.Item>
      </Form>
      <div className="text-center mt-6">
        <span className="text-gray-600">Quay lại </span>
        <Link to="/sign-in" className="text-[#4c7dfc] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  </div>
  );
};

export default RequestPasswordReset;
