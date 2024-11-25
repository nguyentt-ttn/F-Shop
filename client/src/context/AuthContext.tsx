import React, { createContext, useContext, useState } from "react";
import { message } from "antd";
import { useMutation } from "@tanstack/react-query";
import api from "../API";
import { useNavigate } from "react-router-dom";

// Định nghĩa interface cho user và dữ liệu đăng ký
interface User {
  userId: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  signin: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Tạo context với giá trị mặc định là undefined
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Cung cấp AuthContext cho các component con
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  // Đăng nhập
  const signinMutation = useMutation({
    mutationFn: async (formData: { email: string; password: string }) => {
      const response = await api.post("/signin", formData);
      return response.data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.userId);
      localStorage.setItem("role", JSON.stringify(data.user.role));
      message.success("Đăng nhập thành công!");
      // Kiểm tra vai trò của người dùng và điều hướng
      if (data.user.role === "admin") {
        nav("/admin");
      } else {
        nav("/");
      }
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Đăng nhập thất bại.");
    },
  });

  // Đăng ký
  const signupMutation = useMutation({
    mutationFn: async (formData: SignupData) => {
      await api.post("/signup", formData);
    },
    onSuccess: () => {
      message.success("Đăng ký thành công!");
      nav("/sign-in");
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || "Đăng ký thất bại.");
    },
  });

  // Hàm đăng nhập
  const signin = async (email: string, password: string) => {
    await signinMutation.mutateAsync({ email, password });
  };

  // Hàm đăng ký
  const signup = async (data: SignupData) => {
    await signupMutation.mutateAsync(data);
  };

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    message.success("Đăng xuất thành công!");
  };

  return (
    <AuthContext.Provider value={{ user, token, signin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook tùy chỉnh để sử dụng context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
};
