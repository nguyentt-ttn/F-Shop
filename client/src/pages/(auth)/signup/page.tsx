import { Button, Checkbox, Form, Input, message } from "antd";
import { Link, } from "react-router-dom";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import "../auth.page.css";
import { useAuth } from "../../../context/AuthContext";
// type FieldType = {
//   username?: string;
//   email: string;
//   password?: string;
//   confirmPassword?: string;
// };

const SignupPage = () => {
  const { signup } = useAuth();
  const onFinish = async (values: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }
    try {
      await signup(values);
    } catch (error) {
      message.error("Đăng ký không thành công!");
    }
  };

  return (
    <>
      <div className="background-auth min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md mx-4 slide-auth-animation">
          <h1 className="text-2xl font-bold text-center mb-2">
            Create an Account
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Create a account to continue
          </p>

          <Form
            name="sign-up"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              hasFeedback
              rules={[
                { required: true, message: "Vui lòng nhập username của bạn!" },
                {
                  type: "string",
                  min: 3,
                  message: "Username phải có ít nhất 3 ký tự!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your Email!" },
                {
                  type: "email",
                  message: "Vui lòng nhập địa chỉ email hợp lệ!",
                },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
              />
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
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Vui lòng xác nhận password của bạn!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm password"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:border-blue-500"
              />
            </Form.Item>

            <div
              className="flex mb-4"
              style={{ justifyContent: "space-between" }}
            >
              <Checkbox className="ml-2 text-gray-700">
                I accept terms and conditions
              </Checkbox>
              {/* <a href="#" style={{ color: "#4c7dfc" }}>
                Forget Password?
              </a> */}
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-11 bg-[#4c7dfc] text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Sign Up
              </Button>
            </Form.Item>
            <div className="text-center mt-6">
              <span className="text-gray-600"> Already have an account? </span>
              <Link to="/sign-in" className="text-[#4c7dfc] hover:underline">
                Sign In
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
