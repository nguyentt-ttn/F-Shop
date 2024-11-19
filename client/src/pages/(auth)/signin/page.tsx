import { useMutation } from "@tanstack/react-query";
import { Button, Checkbox, Form, Input, message } from "antd";
import api from "../../../API";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import '../auth.page.css'
type FieldType = {
  email: string;
  password?: string;
};

const SigninPage = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();

  const { mutate } = useMutation({
    mutationFn: async (formData: FieldType) => {
      const response = await api.post("/signin", formData);
      return response.data;
    },
    onSuccess: (data) => {
      // Kiểm tra và ghi dữ liệu vào Local Storage
      console.log("API Response:", data);
      if (data && data.token && data.user) {
        const userData = {
          user: data.user.username || data.user.email,
          token: data.token,
          role: data.user.role,
        };
        console.log("User Data to Store:", userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", JSON.stringify(userData.role));
        message.success("Signin success!");
        // Điều hướng dựa trên vai trò người dùng
        if (userData.role === "admin") {
          nav("/admin/dashboard");
        } else {
          nav("/");
        }
      } else {
        message.error("Invalid response data");
      }
    },
    onError: (error: any) => {
      console.log("API Error:", error);
      message.error(error.response?.data?.message || "Signin failed");
    },
  });

  const onFinish = (values: FieldType) => {
    mutate(values);
  };

  return (
    <div className="background-auth min-h-screen flex items-center justify-center">
    <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-4 slide-auth-animation">
        <h1 className="text-2xl font-bold text-center mb-2">Login to Account</h1>
        <p className="text-gray-600 text-center mb-8">Please enter your email and password to continue</p>

        <Form
          name="login"
          onFinish={onFinish}
          initialValues={{ remember: true }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your Email!" },
              { type: "email", message: "Vui lòng nhập địa chỉ email hợp lệ!" },
            ]}
          >
            <Input 
            prefix={<MailOutlined />} 
            placeholder="Email" 
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"/>
          </Form.Item>

          <Form.Item
            name="password"
            hasFeedback
            rules={[
              { required: true, message: "Please input your Password!" },
              { min: 6, message: "Password phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
             className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
            />
          </Form.Item>

            <div className="flex mb-4" style={{ justifyContent: "space-between" }}>
              <Checkbox className="ml-2 text-gray-700" >Remember Password</Checkbox>
              <Link to="/request-password-reset" style={{ color: "#4c7dfc" }}>
                Forget Password?
              </Link>
            </div>
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-11 bg-[#4c7dfc] text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
            >Sign In</Button>
          </Form.Item>
          <div className="text-center mt-6">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/sign-up" className="text-[#4c7dfc] hover:underline" >
              Create Account
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SigninPage;
