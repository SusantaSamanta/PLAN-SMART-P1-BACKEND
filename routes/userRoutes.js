import express from 'express';
import multer from 'multer';
import userAuth from '../middleware/userAuth.js';
import { getUserData, setUserProfile, getUserProfile, setUserProfilePic, setUserCv } from '../controllers/userController.js';

const userRouter = express.Router();

// ✅ Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, './upload'); // folder must exist
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

const uploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 1048576 }, // 1MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png'
      ) {
        // console.log('✅ File accepted:', file.originalname);
        cb(null, true);
      } else {
        cb(new Error('Only .jpg, .jpeg, .png formats are supported'), false);
      }
    } else {
      cb(new Error('Invalid field name. Expected "avatar".'), false);
    }
  },
});

// ✅ Routes
userRouter.get('/data', userAuth, getUserData);
userRouter.post('/set-profile', userAuth, setUserProfile);
userRouter.post('/set-profile-pic', uploader.single('avatar'), userAuth, setUserProfilePic);
userRouter.post('/set-cv', uploader.single('cv'), userAuth, setUserCv);
userRouter.get('/get-profile', userAuth, getUserProfile);

export default userRouter;
