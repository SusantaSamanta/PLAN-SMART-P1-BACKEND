import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import multer from "multer";


import connectDB from "./config/mongodb.js";
import authRouter from './routes/authRoutes.js'
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import userJobRoutes from "./routes/userJobRoutes.js";


const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
  {
    origin: process.env.FRONTEND_URL,
    exposedHeaders: ['X-Total-Count'],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }
));  // use for connect frontend and backend


//API Endpoints
app.get("/", (req, res) => {
  res.send("API working Fine");
});
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/vision/admin", adminRouter);
app.use("/api/user/job", userJobRoutes);
app.use(cookieParser());



app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large! Max allowed size is 1MB.',
      });
    }
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'Something went wrong!',
    });
  }

  next();
});





app.listen(port, () => {
  console.log(`Server started on PORT: ${port}`);
});