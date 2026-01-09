
import mongoose from "mongoose";
import { type } from "os";

const userDataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true,
    },
    profileData: {
        type: String,
        require: true,
    },
    profilePicUrl: {
        type: String,
        default: '../src/assets/dummyProfile.jpg',
        require: true,
    },
    cvUrl: {
        type: String,
        default: '',
        require: true,
    },
    fullyUpdated: {
        type: Boolean,
        require: true,
        default: false,
    }
}, 
    {
        timestamps: true,
    }
)

export const userDataModel = mongoose.model('userData', userDataSchema)


