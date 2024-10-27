const User = require("../models/User");
const mailSender = require("../utils/MailSender");

const bcrypt = require("brcypt");

// resetpasswordtoken:
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email first:
    const email = req.body.email;

    //check email validation:
    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(401).json({
        message:
          "give correct email o change password",
        success: false,
      });
    }

    // token genration;
    const token = crypto.randomUUID();

    // update user by adding token
    const updatedDetails = User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires:
          Date.now() + 5 * 60 * 100,
      },
      {
        new: true,
      }
    );

    // create url:
    // url generator: will generate with the help of tokens:
    const url = `http://localhost:3000/update-password/${token}`;
    // send email with url link:
    await mailSender(
      email,
      "password reset link",
      url
    );
    // return response;
    return res.status(200).json({
      success: false,
      message:
        "password reset email has been sent successfully",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        "mail sent failed for password reset",
    });
  }
};

// reset password:
// in this handler we are updating the password ;
exports.resetPassword = async (req, res) => {
  try {
    // data fetch:
    const {
      newPassword,
      confirmPassword,
      token,
    } = req.body;
    // validation:
    if (
      !newPassword ||
      !confirmPassword ||
      !(newPassword !== confirmPassword)
    ) {
      return res.status(401).json({
        message:
          "all fields are required , passwords should match",
        success: false,
      });
    }
    // get userdeatils from the databases using tokens:
    const userDetails = await User.findOne({
      token: token,
    });
    // if no entry means invalid tokens
    if (!userDetails) {
      return res.status(401).json({
        message: "token is invalid",
        success: false,
      });
    }
    // token time check:
    if (
      userDetails.resetPasswordExpires >
      Date.now()
    ) {
      return res.status(401).json({
        success: false,
        message: "session expired",
      });
    }
    // hash password;
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    //password update;
    await User.findOneAndUpdate(
      { token: token },
      {
        password: hashedPassword,
      },
      {
        new: true,
      }
    );
    // return response;

    return res.status(200).json({
        success:true,
        message:"password updated successfully::"
    })
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "password reset failed !!!",
    });
  }
};
