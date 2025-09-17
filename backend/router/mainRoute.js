import { Router } from "express";
import isSessionAuth from "../middlewares/session.js";

import {
    homePage,
    loginUser,
    logoutUser,
    checkLoginStatus
} from "../controllers/main.js";

const mainRouter = Router();

mainRouter.get('/', homePage);
mainRouter.post('/login', loginUser);
mainRouter.post('/logout', logoutUser);
mainRouter.post('/checkLogin', checkLoginStatus);

export default mainRouter;