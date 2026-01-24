
/////////////////    All below fun are for jod routes //////////////////

import { getUserById } from "../services/authServices.js";
import { applyForJob, findAllInterviews, findAppliedJobs, findInterviewsNotStart, receiveAllJobProfiles, stepOfStartInterview } from "../services/userJobDataServices.js";






export const getAllJobProfile = async (req, res) => {
    const { userId } = req.body;
    if (!userId)
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });

    const userData = await getUserById(userId);
    if (!userData)
        return res.status(401).json({ success: false, message: 'No User Found, login again....!' });

    try {
        const result = await receiveAllJobProfiles(); // if all fields are contain text then return true 
        if (result) {
            return res.status(200).json({ success: true, result });
        } else {
            return res.status(400).json({ success: false, message: 'Api job not working....!' });
        }
    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Sorry api not working, please try again....!', })
    }
}

export const setJobApplication = async (req, res) => {
    const { userId, jobId } = req.body;
    if (!userId)
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });

    const userData = await getUserById(userId);
    if (!userData)
        return res.status(401).json({ success: false, message: 'No User Found, login again....!' });

    try {
        const result = await applyForJob(userId, jobId); // if all fields are contain text then return true 
        if (result) {
            return res.status(200).json({ success: true, result });
        } else {
            return res.status(400).json({ success: false, message: 'Try to reapply after one hour' });
        }

    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Sorry api not working, please try again....!', })
    }
}

export const getAppliedJobs = async (req, res) => {

    const { userId } = req.body;
    if (!userId)
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });

    const userData = await getUserById(userId);
    if (!userData)
        return res.status(401).json({ success: false, message: 'No User Found, login again....!' });

    try {
        const result = await findAppliedJobs(userId);
        if (result) {
            return res.status(200).json({ success: true, notAbleToApply: result.notAbleToApply, ableToApply: result.ableToApply });
        } else {
            return res.status(400).json({ success: false, message: 'Try to reapply after one hour' });
        }

    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Sorry api not working, please try again....!', })
    }
}




export const getPendingInterviews = async (req, res) => {

    const { userId } = req.body;
    if (!userId)
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });

    const userData = await getUserById(userId);
    if (!userData)
        return res.status(401).json({ success: false, message: 'No User Found, login again....!' });

    try {
        const result = await findInterviewsNotStart(userId);
        if (result) {
            return res.status(200).json({ success: true, result });
        } else {
            return res.status(400).json({ success: false, message: 'Try to reapply after one hour' });
        }

    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Sorry api not working, please try again....!', })
    }
}




export const startInterview = async (req, res) => {
    const { userId, applicationId } = req.body;
    if (!userId)
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });

    const userData = await getUserById(userId);
    if (!userData)
        return res.status(401).json({ success: false, message: 'No User Found, login again....!' });

    try {
        const result = await stepOfStartInterview(applicationId);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(201).json(result);
        }

    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Sorry api not working, please try again....!', })
    }
}



export const getCompletedInterview = async (req, res) => {
    const { userId, applicationId } = req.body;
    if (!userId)
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });

    const userData = await getUserById(userId);
    if (!userData)
        return res.status(401).json({ success: false, message: 'No User Found, login again....!' });

    try {
        const result = await findAllInterviews(userId, applicationId);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(201).json(result);
        }

    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Sorry api not working, please try again....!', })
    }
}













