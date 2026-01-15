import { application } from "express";
import { JobApplicationModel } from "../models/jobApplicationModel.js";
import { JobModel } from "../models/jobModel.js";

const waitCall = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 600);
    })
}

export const receiveAllJobProfiles = async () => {
    // await waitCall(); 
    try {
        const jobsData = await JobModel.find().sort({ createdAt: -1 }); //  it send all newest first job profiles 
        return jobsData;
    } catch (error) {
        console.log("receiveAllJobProfiles error:", error);
        return false;
    }
};


export const applyForJob = async (userId, jobId) => {
    try {
        let application = await JobApplicationModel.findOne({
            job: jobId,
            user: userId,
        });

        const now = new Date();
        const ONE_HOUR = 60 * 60 * 1000;
        // const ONE_HOUR = 60 * 600;

        // 🟢 If application does NOT exist → create new
        if (!application) {
            const { _id, attempts } = await JobApplicationModel.create({
                job: jobId,
                user: userId,
                attempts: 1,
                interviewStartedAt: now,
                // isInterviewStarted: false,       
                // interviewStartedAt: now,
            });
            return { jobId, _id, attempts };
        }

        //                   false && 7.30 - 7 = 30 < 1h   X
        //                    true && 7.30 - 7 = 30 < 1h    X
        //                    true && 8.30 - 7 = 1.30 > 1h  _/
        console.log(now - application.interviewStartedAt, ONE_HOUR);
        if (application.isInterviewStarted && now - application.interviewStartedAt > ONE_HOUR) {

            application.attempts += 1;
            application.isInterviewStarted = false;
            application.interviewStartedAt = now;
            // application.isInterviewCompleted = false;

            await application.save();

            return {
                jobId,
                applicationId: application._id,
                attempts: application.attempts,
            }
        } else {
            return false
        }

    } catch (error) {
        console.log("receiveAllJobProfiles error:", error);
        return false;
    }
};


// export const findAppliedJobs = async (userId) => {
//     const now = new Date();
//     const ONE_HOUR = 60 * 60 * 1000;
//     try {
//         let applications = await JobApplicationModel.find(
//             {
//                 user: userId,
//                 isInterviewStarted: false,|| isInterviewStarted: true && now - application.interviewStartedAt > ONE_HOUR)
//             }
//         );

//         return applications;

// export const findAppliedJobs = async (userId) => {
//     try {
//         const ONE_HOUR = 60 * 60 * 1000;
//         const oneHourAgo = new Date(Date.now() - ONE_HOUR);

//         const notAbleToApply = await JobApplicationModel.find({
//             user: userId,
//             $or: [
//                 // Case 1: Interview not started
//                 { isInterviewStarted: false },
//                 // Case 2: Interview started but expired (< 1 hour)
//                 {
//                     isInterviewStarted: true,
//                     interviewStartedAt: { $gte: oneHourAgo },
//                 },
//             ]
//         },
//             {
//                 _id: 1,
//                 job: 1,
//                 attempts: 1,
//             }
//         );
//         return { notAbleToApply };

//     } catch (error) {
//         console.log("findAppliedJobs error:", error);
//         return false;
//     }
// };

export const findAppliedJobs = async (userId) => {
    try {
        const ONE_HOUR = 60 * 60 * 1000;
        const oneHourAgo = new Date(Date.now() - ONE_HOUR);

        // get all applications of user
        const applications = await JobApplicationModel.find(
            { user: userId },
            {
                _id: 1,
                job: 1,
                attempts: 1,
                isInterviewStarted: 1,
                interviewStartedAt: 1,
            }
        );

        const notAbleToApply = [];
        const ableToApply = [];

        applications.forEach(app => {
            console.log(!app.isInterviewStarted ,
                app.isInterviewStarted &&
                app.interviewStartedAt >= oneHourAgo, app._id)
            if ( //  Interview not started || ( started && 1 hour not passed  )
                !app.isInterviewStarted || 
                app.isInterviewStarted &&
                app.interviewStartedAt >= oneHourAgo
            ) {
                //  blocked
                notAbleToApply.push({
                    _id: app._id,
                    job: app.job,
                    attempts: app.attempts,
                });
            } else {
                //  allowed
                ableToApply.push({
                    _id: app._id,
                    job: app.job,
                    attempts: app.attempts,
                });
            }
        });

        return {
            notAbleToApply,
            ableToApply,
        };

    } catch (error) {
        console.log("findAppliedJobs error:", error);
        return false;
    }
};



