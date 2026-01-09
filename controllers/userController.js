import { fileUploadOnCloud } from "../config/cloudinaryConfig.js";
import userModel from "../models/userModel.js";
import { getUserById } from "../services/authServices.js";
import { getProfileData, setProfilePic, updateProfileData } from "../services/userDataSetServices.js";

export const getUserData = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        return res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (err) {
        return res.json({ success: false, message: err.message });
    }
}

export const setUserProfile = async (req, res) => {
    const { userId, profileData } = req.body;
    if (!userId)
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });

    const userData = await getUserById(userId);
    if (!userData) {
        return res.status(401).json({ success: false, message: 'No User Found, login again....!' });
    }

    if (!profileData)
        return res.status(400).json({ success: false, message: 'Give profile information' });

    try {
        const isProfileSet = await updateProfileData(userId, profileData)
        if (isProfileSet) {
            return res.status(200).json({ success: true, message: 'Profile up date successful...' });
        } else {
            return res.status(400).json({ success: false, message: 'profile not update' });

        }

    } catch (err) {
        return res.status(401).json({ success: false, message: 'Sorry api not working, please try again....!', })
    }
}




export const setUserProfilePic = async (req, res) => {


    const { userId } = req.body;
    if (!userId)
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
    if (!req.file)
        return res.status(400).json({ success: false, message: 'Place give an file' });
    console.log(req.file.path + '.jpg');

    const cloudRes = await fileUploadOnCloud(req.file.path);
    // console.log(cloudRes);

    if (cloudRes) {
        const isUrlSave = await setProfilePic(userId, cloudRes);
        if (isUrlSave)
            return res.status(200).json({ success: true, message: 'Ok file uploaded.......', url: cloudRes });
        else
            return res.status(401).json({ success: false, message: 'File not uploaded......' });

    } else {
        return res.status(401).json({ success: false, message: 'File not uploaded......' });
    }
}

export const setUserCv = async (req, res) => {
    const { userId } = req.body;
    if (!userId)
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
    if (!req.file)
        return res.status(400).json({ success: false, message: 'Place give an file' });
    console.log(req.file.path + '.jpg');

    const cloudRes = await fileUploadOnCloud(req.file.path);
    // console.log(cloudRes);

    if (cloudRes) {
        const isUrlSave = await setProfilePic(userId, cloudRes);
        if (isUrlSave)
            return res.status(200).json({ success: true, message: 'Ok file uploaded.......', url: cloudRes });
        else
            return res.status(401).json({ success: false, message: 'File not uploaded......' });

    } else {
        return res.status(401).json({ success: false, message: 'File not uploaded......' });
    }
}

const waitCall = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 4000);
    })
}


export const getUserProfile = async (req, res) => {
    // await waitCall();
    const { userId } = req.body;
    if (!userId)
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });

    const userData = await getUserById(userId);
    if (!userData)
        return res.status(401).json({ success: false, message: 'No User Found, login again....!' });

    try {
        const isProfileGet = await getProfileData(userId)
        if (isProfileGet) {
            return res.status(200).json({ success: true, userProfileData: isProfileGet });
        } else {
            return res.status(400).json({ success: false, message: 'profile not update' });
        }

    } catch (err) {
        return res.status(401).json({ success: false, message: 'Sorry api not working, please try again....!', })
    }
}





