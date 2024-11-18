import { User } from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

export const register = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields!",
    });
  }

  try {
    const checkUser = await User.findOne({ userName });
    if (checkUser) {
      return res.status(400).json({
        success: false,
        message: "User with this username already exists! Please try again.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email,
      },
      message: "Registration successful",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "Server error occurred during registration. Please try again later.",
    });
  }
};

export const login = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields!",
    });
  }

  try {
    const checkUser = await User.findOne({ userName });
    if (!checkUser) {
      return res.status(401).json({
        success: false,
        message: "Wrong username or password.",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong email or password.",
      });
    }

    const token = jwt.sign({ id: checkUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: checkUser._id,
        userName: checkUser.userName,
        email: checkUser.email,
        role: checkUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
};

export const logOut = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Поиск пользователя по email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Генерация токена для сброса
    const resetToken = crypto.randomBytes(20).toString("hex");
    console.log("Generated reset token:", resetToken);

    // Установка токена и срока действия в базе данных
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = Date.now() + 3600000; // Токен действует 1 час
    await user.save();

    // Создание URL для сброса пароля
    const resetUrl = `https://board-games-kappa.vercel.app/reset-password/${resetToken}`;

    // Настройка почтового транспорта
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Настройка email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    };

    // Отправка email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({
          success: false,
          message: "Error sending email.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Email sent successfully.",
      });
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    console.log("Request body:", req.body);

    if (!token || !newPassword) {
      console.log("Missing token or newPassword.");
      return res.status(400).json({
        success: false,
        message: "Please provide a token and new password.",
      });
    }

    console.log("Finding user by token...");
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }, // Проверяем срок действия токена
    });

    if (!user) {
      console.log("User not found or token expired.");
      return res.status(404).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    console.log("User found:", user);

    const hashPassword = await bcrypt.hash(newPassword, 10);
    console.log("Hashed password:", hashPassword);

    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();
    console.log("Password updated and token cleared for user:", user);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};
