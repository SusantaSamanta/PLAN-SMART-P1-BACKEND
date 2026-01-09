import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";


//Function for user registration
export const register = async (req, res) => {
  console.log("Register endpoint hit");
  const { name, email, password } = req.body;
  console.log("Request body:", req.body);

  //Check the data is exists or not
  if (!name || !email || !password) {
    console.log("Missing details");
    return res.status(400).json({ success: false, message: "Missing Details" });
  }

  //Store the data into database
  try {
    console.log("Checking for existing user...");
    //Check the user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const salt = 14;
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    //Save the user
    console.log("Saving user to database...");
    await user.save();
    console.log("User saved successfully.");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 dayd cookie expire time
    });
    //After registration send an welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to PlanSmart",
      text: `Welcome to plansmart website. Your account has been created with email id: ${email}`,
    };

    // await transporter.sendMail(mailOptions);

    //User successfylly register
    console.log("Registration successful. Sending response.");
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================================================================================

//Function for user login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days cookie expire time
    });

    //User successfylly logged in
    return res.status(200).json({ success: true, user: { name: user.name, email } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================================================================

//Logout function
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ success: true, message: "logged Out" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// =============================================================================================

//Send verification OTP to User'e Email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ success: false, message: "Account Already verified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    //Send the otp to the user
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    //Send the email
    await transporter.sendMail(mailOption);
    return res.status(200).json({
      success: true,
      message: "Verification OTP Sent on Email",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Verify User account using OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();
    return res.status(200).json({ success: true, message: "Email Verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Check if the User is authenticated or not
export const isAuthenticated = async (req, res) => {
  try {
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// =======================================================================

//Send reset password OTP
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    //If user found then send the otp to the user
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    //Send the otp to the user
    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${otp}, Use this OTP to proceed with resetting you password.`,
    };

    //Send the email
    await transporter.sendMail(mailOption);
    return res.status(200).json({ success: true, message: "OTP send to your email" });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


//Reset user password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: "Email, OTP, and new password are required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP Expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = '';
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}










const waitCall = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 4000);
  })
}


export const checkUseLogin = async (req, res) => {
  console.log(req.url);
  try {
    if (req.body.userId) {
      const { name, email } = await userModel.findOne({ _id: req.body.userId })
      return res.status(200).json({ success: true, user: { name, email } });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
  }
}




