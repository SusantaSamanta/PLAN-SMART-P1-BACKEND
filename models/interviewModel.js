import mongoose from "mongoose";
import { type } from "os";

const interviewSchema = new mongoose.Schema(
    {
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "jobApplication",
            required: true,
        },

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
        
        whichAttempt: {
            type: Number,
            required: true,
        },
        
        score: {
            type: Number,
            required: true,
        },
        isFullyCompleted: {
            type: Boolean,
            default: false,
        },
        questions:{
            type: String,
            default: 'Tell me about your self',
        },
        // inetrviwe

    },
    {
        timestamps: true,
    }
);


export const interviewModel = mongoose.model(
    "interview",
    interviewSchema
);
