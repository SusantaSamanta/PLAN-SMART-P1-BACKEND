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
        review: {
            type: Array,
            default: "",
        },
        isFullyCompleted: {
            type: Boolean,
            default: false,
        },
        questions: {
            type: Array,
            default: 'Tell me about your self',
        },
        conversation: {
            type: Array,
            default: 'Hello how are you'
        },
    },
    {
        timestamps: true,
    }
);


export const interviewModel = mongoose.model(
    "interview",
    interviewSchema
);
