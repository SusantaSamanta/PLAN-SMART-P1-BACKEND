import jwt from "jsonwebtoken";
import { adminDataModel } from "../models/admin.model.js";
import { JobModel } from "../models/jobModel.js";


export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Missing details...!' });
    }
    try {
        const admin = await adminDataModel.findOne({ adminEmail: email });
        if (!admin) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }
        const isPwMatch = admin.password === password;
        if (!isPwMatch) {
            return res.status(400).json({ success: false, message: 'Invalid email or password.' });
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, //7 days cookie expire time
        });
        //Admin successfully logged in
        return res.status(200).json({ success: true, user: { email } });
    } catch (err) {
        console.log(err);

        return res.status(500).json({ success: false, message: err.message });
    }
}


export const setNewJob = async (req, res) => {
    try {
        // Admin check (from middleware)
        if (!req.admin) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized. Admin only.",
            });
        }

        const {
            sector,
            role,
            title,
            company,
            companyLogo,
            location,
            jobType,
            compensation,
            requiredSkills,
            description,
        } = req.body;

        // Basic validation
        if (
            !sector ||
            !role ||
            !title ||
            !company ||
            !location ||
            !jobType ||
            !compensation ||
            !requiredSkills ||
            !description
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required job fields",
            });
        }

        // Create job
        const newJob = await JobModel.create({
            sector,
            role,
            title,
            company,
            companyLogo,
            location,
            jobType, // map jobtype → jobType
            compensation,
            requiredSkills,
            description,
            createdBy: req.admin._id,
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job: newJob,
        });
    } catch (error) {
        console.log("Create job error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating job",
        });
    }
};



