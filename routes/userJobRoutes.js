import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getAllJobProfile, setJobApplication, getAppliedJobs,
    getPendingInterviews, startInterview,
    getCompletedInterview
 } from '../controllers/userJobController.js';
const userJobRoutes = express.Router();


// Job section routes
userJobRoutes.get('/get-all-job-profile', userAuth, getAllJobProfile);
userJobRoutes.post('/set-job-application', userAuth, setJobApplication);
userJobRoutes.get('/get-applied-jobs', userAuth, getAppliedJobs);
userJobRoutes.get('/get-pending-interviews', userAuth, getPendingInterviews); // give all job application in which isInterviewStart is false 
userJobRoutes.post('/start-interview', userAuth, startInterview); 
userJobRoutes.post('/get-completed-interviews', userAuth, getCompletedInterview); // give all interviews for that user with job details 

export default userJobRoutes;



