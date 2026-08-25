import { Router } from "express";

import {
    homePage,
    loginUser,
    registerUser,
    logoutUser,
    checkLoginStatus
} from "../controllers/main.js";

const mainRouter = Router();

mainRouter.get('/session', homePage);
mainRouter.post('/login', loginUser);
mainRouter.post('/register', registerUser);
mainRouter.post('/logout', logoutUser);
mainRouter.post('/checkLogin', checkLoginStatus);

export default mainRouter;