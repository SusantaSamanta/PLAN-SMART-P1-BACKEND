import { userDataModel } from "../models/userDataModel.js";
import mongoose from "mongoose";

export const updateProfileData = async (userId, profileData) => {
    try {
        const result = await userDataModel.updateOne(
            { user: new mongoose.Types.ObjectId(userId) }, // find by user field
            { $set: { profileData: JSON.stringify(profileData) } },                    // update profileData
            { upsert: true }                              // create if not exist
        );

        return result; // result.acknowledged, modifiedCount, etc.
    } catch (error) {
        console.log("set profile err:", error);
        return false;
    }
};



export const getProfileData = async (userId) => {

    try {
        const { profileData, fullyUpdated, updatedAt, profilePicUrl, cvUrl } = await userDataModel.findOne(
            { user: userId }, // find by user field
        );
        return {
            profileData: JSON.parse(profileData),
            fullyUpdated,
            profilePicUrl,
            cvUrl,
            updatedAt: new Date(updatedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
        }

    } catch (error) {
        console.log("set profile err:", error);
        return false;
    }
};


export const setProfilePic = async (userId, url) => {
    try {
        const result = await userDataModel.updateOne(
            { user: new mongoose.Types.ObjectId(userId) }, // find by user field
            { $set: { profilePicUrl: url } },                    // update profileData
            { upsert: true }                              // create if not exist
        );
        return result;
    } catch (error) {
        console.log("set profile err:", error);
        return false;
    }
};



export const setCvUrl = async (userId, url) => {
    try {
        const result = await userDataModel.updateOne(
            { user: new mongoose.Types.ObjectId(userId) }, // find by user field
            { $set: { cvUrl: url } },                    // update cvUrl '' to 'https://.....'
            { upsert: true }                              // create if not exist
        );
        return result;
    } catch (error) {
        console.log("set profile err:", error);
        return false;
    }
};


export const checkProfileData = async (userId) => {
    try {
        const userData = await userDataModel.findOne({ user: userId });

        if (!userData) return false;

        const {
            profileData,
            profilePicUrl,
            cvUrl,
        } = userData;

        // Parse profileData JSON
        const parsedProfile = JSON.parse(profileData);

        // Required text fields inside profileData
        const requiredProfileFields = [
            parsedProfile.name,
            parsedProfile.email,
            parsedProfile.phone,
            parsedProfile.location,
            parsedProfile.highestQualification,
            parsedProfile.university,
            parsedProfile.graduationYear,
        ];

        // Skills must exist and not be empty
        const hasSkills =
            Array.isArray(parsedProfile.skills) &&
            parsedProfile.skills.length > 0;

        // Profile pic must NOT be default
        const hasProfilePic =
            profilePicUrl &&
            !profilePicUrl.includes("dummyProfile");

        // CV must exist
        const hasCv = Boolean(cvUrl);

        // Final check
        const isComplete =
            requiredProfileFields.every(Boolean) &&
            hasSkills &&
            hasProfilePic &&
            hasCv;

        if (isComplete && !userData.fullyUpdated) {
            userData.fullyUpdated = true;
            await userData.save();
        }

        return isComplete;
    } catch (error) {
        console.log("check profile err:", error);
        return false;
    }
};



