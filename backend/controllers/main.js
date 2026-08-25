import userDB from "../models/user.js";

// GET / or GET /session - Session Info (200 OK)
export const homePage = (req, res) => {
    try {
        return res.status(200).json(req.session || {});
    } catch (err) {
        console.error('HomePage function error:', err);
        return res.status(500).json({ message: 'Server Error' });
    }
};

// POST /login - Authenticate user (200 OK)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = await userDB.findOne(
            { email, password },
            { password: 0, createdAt: 0, createdBy: 0, updatedAt: 0, __v: 0 }
        );
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const userObj = user.toObject ? user.toObject() : user;
        const sessionUser = {
            id: (userObj.id || userObj._id).toString(),
            username: userObj.username,
            email: userObj.email
        };
        req.session.user = sessionUser;
        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ message: 'Session error' });
            }
            return res.status(200).json({ message: 'Login Success', user: sessionUser });
        });
    } catch (err) {
        console.error('LoginUser function error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /logout or GET /logout - Destroy session (200 OK)
export const logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout failed:', err);
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'Logged out successfully' });
    });
};

// POST /register - Register new account (201 Created)
export const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, Email and Password are required' });
    }
    try {
        const existingUser = await userDB.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        const newUser = await userDB.create({
            username,
            email,
            password
        });
        return res.status(201).json({
            message: 'Registration Successful',
            user: {
                id: (newUser.id || newUser._id).toString(),
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (err) {
        console.error('RegisterUser function error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /checkLogin or POST /checkLogin - Check current auth status (200 OK / 401 Unauthorized)
export const checkLoginStatus = (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).json({ message: 'User Logged in.', user: req.session.user });
    } else {
        return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
};