import userDB from "../models/user.js";

export const homePage = (req, res) => {
    try {
        return res.status(200).send(req.session);
    }
    catch (err) {
        console.log('HomePage function error:', err);
        return res.status(500).json({ 'message': 'Server Error' });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userDB.findOne({ email, password }, { _id: 0, password: 0, createdAt: 0, createdBy: 0, updatedAt: 0 });
        if (!user) {
            return res.status(404).json({ message: 'No User Exists' });
        }
        req.session.user = user;
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ message: 'Session error' });
            }
            return res.status(200).json({ message: 'Login Success' });
        });
    } catch (err) {
        console.error('LoginUser function error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Optional: depends on your cookie/session setup
        return res.status(200).json({ message: 'Logged out successfully' });
    });
};

export const checkLoginStatus = (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).json({ message: 'User Logged in.' });
    } else {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
};