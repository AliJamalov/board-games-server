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

    // Поиск пользователя в базе данных
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Генерация токена для сброса пароля
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Создание URL для сброса пароля
    const resetUrl = `https://board-games-server-sz9k.onrender.com/api/reset-password/${resetToken}`;

    // Настройка транспондера для отправки почты через Gmail
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // SMTP-сервер Gmail
      port: 587, // Порт для STARTTLS
      secure: false, // Используем STARTTLS (false для 587 порта)
      auth: {
        user: process.env.EMAIL_USER, // Ваша почта Gmail
        pass: process.env.EMAIL_PASS, // Пароль приложения Gmail
      },
    });

    // Опции письма
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    };

    // Отправка письма
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error); // Логирование ошибок для отладки
        return res.status(500).json({
          success: false,
          message: "Error sending email.",
        });
      }

      // Успешная отправка письма
      res.status(200).json({
        success: true,
        message: "Email sent successfully.",
      });
    });
  } catch (error) {
    // Обработка неожиданных ошибок
    console.error("Forgot Password Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred. Please try again later.",
    });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide a token and new password.",
    });
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  const hashPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been reset successfully.",
  });
};
