import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "job",
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },

        attempts: {
            type: Number,
            default: 1,
        },

        interviewStartedAt: {
            type: Date,
            default: null,
        },

        isInterviewStarted: {
            type: Boolean,
            default: false,
        },
        
        isInterviewCompleted: {
            type: Boolean,
            default: false,
        },

    },
    {
        timestamps: true,
    }
);


export const JobApplicationModel = mongoose.model(
    "jobApplication",
    jobApplicationSchema
);
