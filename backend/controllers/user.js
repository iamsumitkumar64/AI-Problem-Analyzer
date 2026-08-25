import mongoose from 'mongoose';
import userDB from '../models/user.js';
import requestDB from '../models/request.js';
import { delfile } from '../config/delete_file.js';

// Helper to construct query matching user by custom id or _id and ensuring owner isolation
const buildUserFilter = (id, creatorId) => {
    const idFilter = mongoose.Types.ObjectId.isValid(id)
        ? { $or: [{ id: new mongoose.Types.ObjectId(id) }, { _id: new mongoose.Types.ObjectId(id) }] }
        : { id };

    const creatorFilter = mongoose.Types.ObjectId.isValid(creatorId)
        ? { $or: [{ createdBy: new mongoose.Types.ObjectId(creatorId) }, { createdBy: creatorId }] }
        : { createdBy: creatorId };

    return { $and: [idFilter, creatorFilter] };
};

// GET /users - Retrieve a list of all users (200 OK)
export const getAllUsers = async (req, res) => {
    try {
        const creatorId = req.session?.user?.id;
        const creatorFilter = mongoose.Types.ObjectId.isValid(creatorId)
            ? { $or: [{ createdBy: new mongoose.Types.ObjectId(creatorId) }, { createdBy: creatorId }] }
            : { createdBy: creatorId };

        const users = await userDB.find(creatorFilter, { password: 0, __v: 0 });
        const formattedUsers = users.map((user) => {
            const userObj = user.toObject ? user.toObject() : user;
            return {
                ...userObj,
                id: (userObj.id || userObj._id).toString()
            };
        });
        return res.status(200).json({ message: 'All Users', users: formattedUsers });
    } catch (err) {
        console.error('getAllUsers function error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// GET /users/:id - Retrieve a specific user by their unique ID (200 OK)
export const getUserById = async (req, res) => {
    const { id } = req.params;
    const creatorId = req.session?.user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const filter = buildUserFilter(id, creatorId);
        const user = await userDB.findOne(filter, { password: 0, __v: 0 });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userObj = user.toObject ? user.toObject() : user;
        return res.status(200).json({
            message: 'User retrieved successfully',
            user: {
                ...userObj,
                id: (userObj.id || userObj._id).toString()
            }
        });
    } catch (err) {
        console.error('getUserById function error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// POST /users - Create a brand new user resource (201 Created)
export const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: 'Username and Email are required' });
    }

    try {
        const existingUser = await userDB.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const creatorId = req.session?.user?.id;
        const newId = new mongoose.Types.ObjectId();
        const newUser = await userDB.create({
            id: newId,
            username,
            email,
            password: password || '123',
            createdBy: mongoose.Types.ObjectId.isValid(creatorId)
                ? new mongoose.Types.ObjectId(creatorId)
                : creatorId
        });

        return res.status(201).json({
            message: 'User Created',
            user: {
                id: (newUser.id || newUser._id).toString(),
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            }
        });
    } catch (err) {
        console.error('createUser function error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// PUT /users/:id - Replace / completely update an existing user (200 OK)
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const creatorId = req.session?.user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (!username || !email) {
        return res.status(400).json({ message: 'Username and Email are required' });
    }

    try {
        const filter = buildUserFilter(id, creatorId);
        const user = await userDB.findOne(filter);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if new email belongs to another existing user
        const existingUser = await userDB.findOne({
            email,
            _id: { $ne: user._id }
        });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        user.username = username;
        user.email = email;
        if (password) {
            user.password = password;
        }
        await user.save();

        return res.status(200).json({
            message: 'User Updated',
            user: {
                id: (user.id || user._id).toString(),
                username: user.username,
                email: user.email,
                updatedAt: user.updatedAt
            }
        });
    } catch (err) {
        console.error('updateUser function error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// PATCH /users/:id - Partially update specific fields of a user (200 OK)
export const patchUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const creatorId = req.session?.user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const filter = buildUserFilter(id, creatorId);
        const user = await userDB.findOne(filter);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (updates.email && updates.email !== user.email) {
            const existingUser = await userDB.findOne({
                email: updates.email,
                _id: { $ne: user._id }
            });
            if (existingUser) {
                return res.status(409).json({ message: 'Email already exists' });
            }
            user.email = updates.email;
        }

        if (updates.username !== undefined) {
            user.username = updates.username;
        }
        if (updates.password !== undefined) {
            user.password = updates.password;
        }

        await user.save();

        return res.status(200).json({
            message: 'User Partially Updated',
            user: {
                id: (user.id || user._id).toString(),
                username: user.username,
                email: user.email,
                updatedAt: user.updatedAt
            }
        });
    } catch (err) {
        console.error('patchUser function error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// DELETE /users/:id - Delete a specific user permanently (204 No Content)
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const creatorId = req.session?.user?.id;

    if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const filter = buildUserFilter(id, creatorId);
        const user = await userDB.findOneAndDelete(filter);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userIds = [user.id, user._id].filter(Boolean);
        const requests = await requestDB.find(
            { createdBy: { $in: userIds } },
            { file_name: 1, _id: 0 }
        );
        await requestDB.deleteMany({ createdBy: { $in: userIds } });
        requests.forEach((item) => {
            if (item.file_name) delfile(item.file_name);
        });

        return res.status(204).send();
    } catch (err) {
        console.error('deleteUser function error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};