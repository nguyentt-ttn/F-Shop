import bcrypt from "bcryptjs";
import crypto from "crypto";
import { SMTPClient } from "emailjs";
import { StatusCodes } from "http-status-codes";
import Joi from "joi";
import jwt from "jsonwebtoken";
import User from "../models/user";

const signupSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),

  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Mật khẩu không khớp",
  }),
});

const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details[0].message });
    }

    const { username, email, password } = req.body;
    const existingEmailUser = await User.findOne({ email });

    if (existingEmailUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Email đã tồn tại" });
    }

    const existingUsernameUser = await User.findOne({ username });
    if (existingUsernameUser) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "User đã tồn tại" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(StatusCodes.CREATED).json({ message: "Đăng ký thành công" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

// Controller để đăng nhập người dùng
export const signin = async (req, res) => {
  try {
    // Validate request body
    const { error } = signinSchema.validate(req.body);
    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details[0].message });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Email không tồn tại" });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Mật khẩu không đúng" });
    }

    // Tạo token và trả về cho người dùng
    console.log("JWT Secret:", process.env.VITE_JWT_SECRET);
    const token = jwt.sign({ userId: user._id }, process.env.VITE_JWT_SECRET, {
      expiresIn: "1h",
    });
    // // Sanitize user object
    const sanitizedUser = {
      userId: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    res.status(StatusCodes.OK).json({ token, user: sanitizedUser });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Yêu cầu đặt lại mật khẩu
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Người dùng không tồn tại" });
    }

    // Tạo token đặt lại mật khẩu
    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 giờ
    await user.save();

    // Tạo client emailjs
    const client = new SMTPClient({
      user: import.meta.env.VITE_EMAIL_USER,
      password: import.meta.env.VITE_EMAIL_PASS,
      host: "smtp.gmail.com",
      port: 465,
      ssl: true,
    });

    // Gửi email với token đặt lại mật khẩu
    //http://${req.headers.host}/reset/${token}\n\n
    const frontendUrl = `${req.protocol}://${req.get('host').replace('8080', '5173')}`; // Thay '8080' thành cổng frontend
    const resetPasswordLink = `${frontendUrl}/reset/${token}`;
    const message = {
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                   Please click on the following link, or paste this into your browser to complete the process:\n\n
                    ${resetPasswordLink}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      from: "passwordreset@yourdomain.com",
      to: user.email,
      subject: "Password Reset",
    };

    // client.send(message, (err, message) => {
    //   if (err) {
    //     return res
    //       .status(StatusCodes.INTERNAL_SERVER_ERROR)
    //       .json({ message: err.message });
    //   }
    //   res
    //     .status(StatusCodes.OK)
    //     .json({ message: "Email đặt lại mật khẩu đã được gửi" });
    // });
    client.send(message, (err, info) => {
      if (err) {
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: "Gửi email thất bại", error: err.message });
      }
    
      res
        .status(StatusCodes.OK)
        .json({ message: "Email đặt lại mật khẩu đã được gửi" });
    });
    

  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

// Đặt lại mật khẩu
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    // Kiểm tra token và thời gian hết hạn
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({
          message: "Token đặt lại mật khẩu không hợp lệ hoặc đã hết hạn",
        });
    }

    const hashedPassword  = await bcrypt.hash(newPassword,10)
    user.password = hashedPassword 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res
      .status(StatusCodes.OK)
      .json({ message: "Mật khẩu đã được đặt lại thành công" });
  } catch (error) {
    console.error("Lỗi đặt lại mật khẩu:", error.message)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
// Lấy thông tin người dùng hiện tại
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "Không có quyền truy cập" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Người dùng không tồn tại" });
    }
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Đã xảy ra lỗi trong quá trình lấy thông tin người dùng",
    });
  }
};
