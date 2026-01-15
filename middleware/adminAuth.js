import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    const { adminToken } = req.cookies;
    if (!adminToken) {
        return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
    }
    req.admin = null;
    try {
        const tokenDecode = jwt.verify(adminToken, process.env.JWT_SECRET);
        if (tokenDecode.id)
            req.admin = tokenDecode.id;
        else
            return res.status(401).json({ success: false, message: 'Not Authorized. Login Again.' });
        next();

    } catch (err) {
        return res.status(401).json({ success: false, message: err.message });
    }
}

export default adminAuth;