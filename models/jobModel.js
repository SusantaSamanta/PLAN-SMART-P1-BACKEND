import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        sector: {
            type: String,
            required: true, // AI / ML, Web, Data Analytics etc.
        },

        role: {
            type: String,
            required: true, // Freshers / Experienced
            enum: ["Freshers", "Experienced", "Both"],
            default: "Freshers",
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        company: {
            type: String,
            required: true,
        },

        companyLogo: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            required: true,
        },

        jobType: {
            type: String,
            enum: ["Full Time", "Part Time", "Internship", "Contract"],
            required: true,
        },

        // Compensation
        compensation: {
            type: {
                type: String, // CTC / Stipend
                enum: ["CTC", "Stipend"],
                required: true,
            },
            value: {
                type: String, // "4 – 8 LPA"
                required: true,
            },
        },

        // Skills
        requiredSkills: {
            type: [String],
            required: true,
        },

        // Job description (multiple points)
        description: {
            type: [String],
            required: true,
        },
        applicationDeadline: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

export const JobModel = mongoose.model("job", jobSchema);
