import mongoose from 'mongoose';
import userDB from '../models/user.js';
import requestDB from '../models/request.js';
import { delfile } from '../config/delete_file.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await userDB.find({ createdBy: req.session.user.id }, { password: 0, __v: 0, _id: 0 });
        return res.status(200).json({ message: 'All Users', users });
    } catch (err) {
        console.log('getAllUsers function error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const createUser = async (req, res) => {
    const { username, email } = req.body;
    try {
        const existingUser = await userDB.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }
        await userDB.create({
            username, email,
            createdBy: new mongoose.Types.ObjectId(req.session.user.id)
        });
        return res.status(201).json({ message: 'User Created' });
    } catch (err) {
        console.log('createUser function error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        await userDB.findOneAndDelete({ id: req.headers.id });
        let ans = await requestDB.find({ createdBy: req.headers.id }, { file_name: 1, _id: 0 });
        await requestDB.deleteMany({ createdBy: req.headers.id });
        ans.forEach((item) => {
            delfile(item.file_name);
        });
        return res.status(200).json({ message: 'User Deleted' });
    } catch (err) {
        console.log('deleteUser function error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateUser = async (req, res) => {
    const { username, email } = req.body.headers;
    try {
        const existingUser = await userDB.findOne({ email });
        if (existingUser && existingUser.email === email && existingUser.username === username) {
            return res.status(409).json({ message: 'Username-Email already exists' });
        }
        await userDB.findOneAndUpdate(
            { id: req.body.id },
            { username, email }
        );
        return res.status(200).json({ message: 'User Updated' });
    } catch (err) {
        console.log('updateUser function error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};