import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: [path.join(__dirname, '.env'), path.join(__dirname, '../.env')] });

export const connectDB = async () => {
    const mongoUrl = process.env.MONGODB_URL || 'mongodb://mongodb:27017';
    const dbName = process.env.MONGODB_NAME || 'ai_problem_analyzer';
    const dbURI = `${mongoUrl}/${dbName}`;
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB =>', dbURI);
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};