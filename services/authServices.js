// import { userDataModel } from "../models/userDataModel";
import userModel from "../models/userModel.js";




export const getUserById = async (id) => {
    try {
        return await userModel.findOne({ _id: id })
    } catch (error) {
        return false;
    }
}