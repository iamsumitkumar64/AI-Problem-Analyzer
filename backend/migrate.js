import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import userDB from './models/user.js';
import requestDB from './models/request.js';
import reportDB from './models/Report.js';
import { connectDB } from './DbConnect.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const runMigration = async () => {
    try {
        await connectDB();

        // 1. Create or ensure Admin user
        let admin = await userDB.findOne({ email: 'admin@gmail.com' });
        if (!admin) {
            admin = await userDB.create({ username: 'admin', email: 'admin@gmail.com', password: '123' });
        }

        // 2. Read example data from example.json
        const exampleGrievances = JSON.parse(fs.readFileSync(path.join(__dirname, 'example.json'), 'utf8'));

        // 3. Upsert global example request (visible to all users)
        const title = "Example: Village Grievances & Shikayats (ग्राम पंचायत जनसुनवाई)";
        let request = await requestDB.findOneAndUpdate(
            { title },
            {
                title,
                description: "Sample public grievances dataset showing multi-ward villager problems and AI analytics.",
                status: "Complete",
                documents: exampleGrievances.length,
                file_name: "dummy_village_grievances_2026.pdf",
                createdBy: null
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        const requestId = request.id || request._id;

        // 4. Upsert corresponding report data
        await reportDB.findOneAndUpdate(
            { requestId },
            { requestId, reportData: exampleGrievances },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log(`✅ Migration complete: Admin created & seeded ${exampleGrievances.length} example grievances.`);
    } catch (err) {
        console.error("❌ Migration error:", err.message);
    } finally {
        process.exit(0);
    }
};

runMigration();