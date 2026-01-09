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
        const { profileData, fullyUpdated, updatedAt, profilePicUrl } = await userDataModel.findOne(
            { user: userId }, // find by user field
        );
        return {
            profileData: JSON.parse(profileData),
            fullyUpdated,
            profilePicUrl,
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
