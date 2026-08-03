import path from 'path';
import http from 'http';
import express from 'express';
import { fileURLToPath } from 'url';
import { connectDB } from './DbConnect.js';
import mainRouter from './router/mainRoute.js';
import userRouter from './router/usersRoute.js';
import requestRouter from './router/requestRoute.js';
import reportRouter from './router/reportRoute.js';
import isSessionAuth from './middlewares/session.js';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
import {initializeSocket} from './config/socket.js';

import fs from 'fs';

const app = express();
const server = http.createServer(app);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: [path.join(__dirname, '.env'), path.join(__dirname, '../.env')] });

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.PORT || 8080;
const frontend_url = process.env.FRONTEND_URL;
connectDB();

initializeSocket(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static(uploadsDir));
app.use(cors({
  origin: frontend_url,
  method: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: `${process.env.MONGODB_URL}/${process.env.MONGODB_NAME}`,
  }),
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 1 }  //set secure true only when use HTTPS    
}));

app.use('/', mainRouter);
app.use('/user', isSessionAuth, userRouter);
app.use('/report', isSessionAuth, reportRouter);
app.use('/request', isSessionAuth, requestRouter);

server.listen(PORT, () => {
  console.log(`Connected to Server => http://localhost:${PORT}`);
});

export { __dirname };