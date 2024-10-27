const User = require("../models/User");
const OTP = require("../models/Otp");
const Profile = require("../models/Profile"); // Add this line if Profile is a model
const otpgenerator = require("otp-generator");
const bcrypt = require("bcrypt"); // Corrected import
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();

// send OTP:
exports.otpSend = async (req, res) => {
  try {
    const { email } = req.body;
    const existUser = await User.findOne({
      email,
    });

    if (existUser) {
      return res
        .status(401)
        .json({
          success: false,
          message: "User already registered",
        });
    }

    // Generate unique OTP:
    let otp;
    do {
      otp = otpgenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    } while (await OTP.findOne({ otp }));

    const otpBody = await OTP.create({
      email,
      otp,
    });
    console.log(otpBody);

    return res
      .status(200)
      .json({
        message: "OTP successfully created",
        success: true,
        otp,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message:
          "Error occurred while sending OTP",
        success: false,
      });
  }
};

// sign up:
exports.signUp = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      contactNumber,
      otp,
      accountType,
      password,
      confirmPassword,
    } = req.body;
    if (
      !email ||
      !firstName ||
      !lastName ||
      !contactNumber ||
      !otp ||
      !confirmPassword ||
      !password
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "All fields are required",
        });
    }

    if (password !== confirmPassword) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Passwords do not match",
        });
    }

    const existUser = await User.findOne({
      email,
    });
    if (existUser) {
      return res
        .status(403)
        .json({
          success: false,
          message: "User already exists",
        });
    }

    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (
      !recentOtp.length ||
      otp !== recentOtp[0].otp
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or missing OTP",
        });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      contactNumber: null,
      about: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res
      .status(200)
      .json({
        message: "User registered successfully",
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Signup failed",
        success: false,
      });
  }
};

// login:
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Login data validation failed",
        });
    }

    const userEmail = await User.findOne({
      email,
    }).populate("additionalDetails");
    if (!userEmail) {
      return res
        .status(401)
        .json({
          message:
            "User does not exist, login failed",
          success: false,
        });
    }

    if (
      await bcrypt.compare(
        password,
        userEmail.password
      )
    ) {
      const payload = {
        email: userEmail.email,
        id: userEmail._id,
        accountType: userEmail.accountType,
   
      };
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      const options = {
        expires: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };

      res
        .cookie("token", token, options)
        .status(200)
        .json({
          success: true,
          token,
          user: userEmail,
          message: "Logged in successfully",
        });
    } else {
      return res
        .status(401)
        .json({
          success: false,
          message: "Incorrect password",
        });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({
        message: "Login failed",
        success: false,
      });
  }
};

// change password:
const mailSender = require('./path/to/mailSender'); // Adjust path as needed

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password validation failed",
      });
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }


    // save the new password in database:
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send email notification
    await mailSender(
      user.email,
      "Password Update Confirmation",
      `<p>Hello ${user.firstName},</p><p>Your password has been successfully updated.</p><p>If you did not make this change, please contact our support team immediately.</p><p>Best regards,<br>Your Team</p>`
    );

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Password update failed",
      success: false,
    });
  }
};

