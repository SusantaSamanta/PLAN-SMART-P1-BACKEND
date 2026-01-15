import express from 'express';
import { adminLogin, setNewJob } from '../controllers/adminController.js';
import adminAuth from '../middleware/adminAuth.js';

const adminRouter = express.Router();
adminRouter.post('/login', adminLogin);
adminRouter.post('/set-new-job', adminAuth, setNewJob);



export default adminRouter;
