import { application } from "express";
import { JobApplicationModel } from "../models/jobApplicationModel.js";
import { JobModel } from "../models/jobModel.js";
import { interviewModel } from "../models/interviewModel.js";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { userDataModel } from "../models/userDataModel.js";
import { GoogleGenAI } from '@google/genai';


const waitCall = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 3000);
    })
}

export const receiveAllJobProfiles = async () => {
    await waitCall();
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

        //  If application does NOT exist → create new
        if (!application) {
            const { _id, attempts } = await JobApplicationModel.create({
                job: jobId,
                user: userId,
                attempts: 1,
                interviewStartedAt: now,
                // isInterviewStarted: false,  by default
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
            // console.log(!app.isInterviewStarted ,
            //     app.isInterviewStarted &&
            //     app.interviewStartedAt >= oneHourAgo, app._id)
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
            } else { // started and one hour passed  //  allowed

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




export const findInterviewsNotStart = async (userId) => {
    // await waitCall();
    try {
        const interviews = await JobApplicationModel.find({
            user: userId,
            isInterviewStarted: false, // Inter views which are not started 
        })
            .populate("job")
            .sort({
                interviewStartedAt: -1, // newest first
                createdAt: -1           // fallback
            });

        return interviews;
    } catch (error) {
        console.log("findInterviewsNotStart error:", error);
        return false;
    }
};



export const stepOfStartInterview = async (userId, applicationId) => {
    // await waitCall();
    // console.log(applicationId)
    //////////    First step : change application data     ////////////
    try {
        const app = await JobApplicationModel.findOne({
            _id: applicationId,
        });
        if (!app) {
            return { success: false, message: 'No application found!' };
        }
        if (app.isInterviewStarted) { // if true 
            // return { success: false, message: 'Interview already done.' };
        }
        // app.isInterviewStarted = true;
        app.interviewStartedAt = new Date();
        app.attempts = app.attempts + 1;
        // app.isInterviewCompleted = false;
        await app.save();

        // Create new interview and save in DB with initial data 
        const interview = await interviewModel.create({
            application: app._id,
            job: app.job,
            user: app.user,
            whichAttempt: app.attempts,
            // score: 0,
            // isFullyCompleted: false,
        })


        //////////    2nd step : Generate interview questions By gemini   ////////////

        const questions = await generateInterviewQuestions(userId, app.job)

        if (questions.success) { // it gemini generate question then save it to DB 
            // console.log(questions.questions);
            interview.questions = questions.questions;
            interview.save();
            return { success: true, interview };
        } else {
            return { success: false, message: "Some think wrong AI gent not generate questions..!" };
        }




    } catch (error) {

        console.log("findInterviewsNotStart error:", error);
        return false;
    }
};


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});
const generateInterviewQuestions = async (userId, jobId) => {
    const { profileData, cvUrl, fullyUpdated } =
        await userDataModel.findOne({ user: userId });

    if (!fullyUpdated) {
        return { success: false, message: 'Your profile is not complete' };
    }
    const { role, title, requiredSkills } = await JobModel.findOne({ _id: jobId });
    console.log(role, title, requiredSkills);

    const userData = JSON.parse(profileData);

    // Convert Cloudinary raw PDF → image (page 1)
    const cvImageUrl = cvUrl
        .replace("/raw/upload/", "/image/upload/")
        .replace("/image/upload/", "/image/upload/pg_1,w_1200,q_auto/");





    /* const response = await ai.models.generateContent({
         model: "gemini-2.5-flash",
         contents: [
             {
                 role: "user",
                 parts: [
                     {
                         text: `
                                 You are a professional technical interviewer.
     
                                 Input:
                                 - Candidate profile data (JSON):
                                 ${JSON.stringify(userData)}
                                 - Candidate job tittle:
                                 ${title}
                                 - Candidate job profile required skills (JSON):
                                 ${JSON.stringify(requiredSkills)}
     
                                 - Candidate CV (image)
     
                                 Tasks:
                                 1. Read and understand the candidate CV.
                                 2. Analyze the candidate profile data.
                                 3. Internally identify skills and education.
                                 4. Generate exactly 10 interview questions suitable for a ${role}.
                                 5. Questions must be based on the candidate profile and job profile required skills.
     
                                 STRICT RULES:
                                 - Return ONLY a valid JSON array.
                                 - Do NOT include explanations.
                                 - Do NOT include headings.
                                 - Do NOT include any text outside JSON.
                                 - Do NOT number questions outside the strings.
     
                                 Output format example:
                                 [
                                   "Question 1",
                                   "Question 2",
                                   "Question 3"
                                 ]
                             `
                     },
                     // {
                     //     fileData: {
                     //         mimeType: "image/png",
                     //         fileUri: cvImageUrl
                     //     }
                     // }
                 ]
             }
         ]
     });*/

    const response = {
        text: [
            "You've listed Python as a skill. Can you explain the difference between a list and a tuple in Python and describe a scenario where you would prefer using one over the other?",
            'Given your interest in AI, can you briefly explain the core difference between supervised and unsupervised machine learning algorithms?',
            'When working with data for machine learning, data preprocessing is crucial. What are some common challenges you might encounter during this phase, and how would you approach handling them?',
            'You mentioned familiarity with OpenCV. Can you describe a basic image processing operation you can perform with OpenCV and its potential application in AI?',
            "How would you typically handle missing values in a dataset using Python's Pandas library?",
            'What is the primary purpose of NumPy in scientific computing with Python, and can you give an example of a common operation you would use it for?',
            'Can you name at least two different libraries in Python that are commonly used for data visualization, and describe a type of plot you would generate with each?',
            'From your BCA and MCA studies, how do you think your academic background has prepared you to understand and apply machine learning concepts?',
            'If you were to build a simple classification model using Scikit-learn, what would be the typical sequence of steps you would follow from data loading to model evaluation?',
            "Considering the required skill of 'strong Python programming', can you explain what a decorator is in Python and provide a simple example of its use?"
        ]
    }
    if (!response.text) {
        return { success: false, message: 'API not working' };
    }

    return {
        success: true,
        questions: response.text
        // questions: JSON.parse(response.text)
    };

};
/*
 questions: [
    "You've listed Python as a skill. Can you explain the difference between a list and a tuple in Python and describe a scenario where you would prefer using one over the other?",
    'Given your interest in AI, can you briefly explain the core difference between supervised and unsupervised machine learning algorithms?',
    'When working with data for machine learning, data preprocessing is crucial. What are some common challenges you might encounter during this phase, and how would you approach handling them?',
    'You mentioned familiarity with OpenCV. Can you describe a basic image processing operation you can perform with OpenCV and its potential application in AI?',
    "How would you typically handle missing values in a dataset using Python's Pandas library?",
    'What is the primary purpose of NumPy in scientific computing with Python, and can you give an example of a common operation you would use it for?',
    'Can you name at least two different libraries in Python that are commonly used for data visualization, and describe a type of plot you would generate with each?',
    'From your BCA and MCA studies, how do you think your academic background has prepared you to understand and apply machine learning concepts?',
    'If you were to build a simple classification model using Scikit-learn, what would be the typical sequence of steps you would follow from data loading to model evaluation?',
    "Considering the required skill of 'strong Python programming', can you explain what a decorator is in Python and provide a simple example of its use?"
  ]
*/


// export const stepOfEndInterview = async (userId, interviewId, conversation) => {
//     try {
//         const interview = await interviewModel.findOne({ _id: interviewId });
//         // console.log(interview)
//         if (!interview) return { success: false, message: "interview end error" }
//         interview.conversation = conversation;
//         interview.isFullyCompleted = true;
//         interview.review = "Avery this is good but you need to improve communication skills.";
//         interview.score = 60;
//         interview.save();

//         return { success: true, message: "interview end error" }

//     } catch (error) {
//         console.log("interview end error", error);
//         return { success: false, message: "interview end error" }
//     }
// }

// // jhvh

export const stepOfEndInterview = async (
    userId,
    interviewId,
    conversation
) => {
    try {

        const interview = await interviewModel.findById(interviewId);

        if (!interview) {
            return {
                success: false,
                message: "Interview not found"
            };
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
            You are an expert technical interviewer.
                    
            Analyze the following interview conversation and evaluate the candidate.
                    
            Conversation:
            ${JSON.stringify(conversation, null, 2)}
                    
            Return ONLY a valid JSON object.
                    
            Required Format:
                    
            {
              "overallScore": 0,
              "communicationScore": 0,
              "technicalScore": 0,
              "strengths": [],
              "areasOfImprovement": [],
              "feedback": ""
            }
                    
            Rules:
            - Scores must be between 0 and 10.
            - strengths must be an array of strings.
            - areasOfImprovement must be an array of strings.
            - feedback must be a short paragraph.
            - strengths areasOfImprovement must contain SHORT summary points only. feedback must be a short overall summary. each must be with in 20 word
            - Return ONLY JSON.
            - Do NOT use markdown.
            - Do NOT wrap response inside \`\`\`json.
            - Do NOT include explanations.
            `
        });

        // Gemini response text
        let rawText = response.text;

        // Some SDK versions use response.text()
        if (typeof rawText === "function") {
            rawText = response.text();
        }

        console.log("Gemini Raw Response:");
        console.log(rawText);

        let review;

        try {

            // Remove markdown fences if Gemini still returns them
            const cleanedText = rawText
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            // Extract only JSON object
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

            if (!jsonMatch) {
                throw new Error("No valid JSON found in Gemini response");
            }

            review = JSON.parse(jsonMatch[0]);

        } catch (parseError) {

            console.log("Gemini JSON Parse Error:", parseError);

            review = {
                overallScore: 0,
                communicationScore: 0,
                technicalScore: 0,
                strengths: [],
                areasOfImprovement: [
                    "Unable to generate review"
                ],
                feedback: "Review generation failed."
            };
        }

        interview.conversation = conversation;
        interview.review = review;
        interview.isFullyCompleted = true;

        await interview.save();

        return {
            success: true,
            review,
            message: "Interview completed successfully"
        };

    } catch (error) {

        console.log("Interview End Error:", error);

        return {
            success: false,
            message: "Interview End Error"
        };
    }
};





export const findAllInterviews = async (userId) => {

    try {

    } catch (error) {

        console.log("findInterviewsNotStart error:", error);
        return false;
    }
};


















