import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId()
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        default: "123"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        default: null
    }
}, { timestamps: true });

const userDB = mongoose.model('Users', userSchema);

export default userDB;