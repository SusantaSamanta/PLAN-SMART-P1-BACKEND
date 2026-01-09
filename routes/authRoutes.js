import express from 'express';
import {
    isAuthenticated, login, logout, register,
    resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail,
    checkUseLogin
} from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

// End-point routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.post('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);


authRouter.get('/check-user-login', userAuth, checkUseLogin); /// to check is user login or not at the time when page reloaded



export default authRouter;
