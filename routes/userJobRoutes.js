import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getAllJobProfile, setJobApplication, getAppliedJobs } from '../controllers/userJobController.js';
const userJobRoutes = express.Router();


// Job section routes
userJobRoutes.get('/get-all-job-profile', userAuth, getAllJobProfile);
userJobRoutes.post('/set-job-application', userAuth, setJobApplication);
userJobRoutes.get('/get-applied-jobs', userAuth, getAppliedJobs);

export default userJobRoutes;