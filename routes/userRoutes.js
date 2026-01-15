import express from 'express';
import multer from 'multer';
import userAuth from '../middleware/userAuth.js';
import { getUserData, setUserProfile, 
  getUserProfile, setUserProfilePic, setUserCv, 
  setUserProfileFinal} from '../controllers/userController.js';

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
        cb(new Error('Only .jpg, .jpeg, .png formats are allowed'), false);
      }
    } else {
      cb(new Error('Invalid field name. Expected "avatar".'), false);
    }
  },
});

const cvUploader = multer({
  storage: multer.diskStorage({}),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'cv') {
      if (
        file.mimetype === 'application/pdf'
        // file.mimetype === 'image/jpg' 
        // file.mimetype === 'image/png'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Only .pdf, .docx, formats are allowed'), false);
      }
    } else {
      cb(new Error('Invalid field name. Expected "cv".'), false);
    }
  },
});

// User profile Routes
userRouter.get('/data', userAuth, getUserData);
userRouter.post('/set-profile', userAuth, setUserProfile);
userRouter.post('/set-profile-pic', uploader.single('avatar'), userAuth, setUserProfilePic);
userRouter.post('/set-cv', cvUploader.single('cv'), userAuth, setUserCv);
userRouter.get('/get-profile', userAuth, getUserProfile);
userRouter.get('/final-profile-submit', userAuth, setUserProfileFinal);





export default userRouter;
