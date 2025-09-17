import userDB from './models/user.js';
import { connectDB } from './DbConnect.js';

connectDB();
const newUser = async (username, email, password = "123") => {
    try {
        await userDB.create({ username, email, password });
        console.log("User created");
    } catch (err) {
        console.error("Error creating user:", err.message);
    } finally {
        process.exit(0);
    }
};

newUser('admin', 'admin@gmail.com');

// By Default password is 123 but if want your then send as argument