import { Router } from 'express';
import {
    getAllUsers,
    createUser,
    deleteUser,
    updateUser
} from '../controllers/user.js';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.post('/', createUser);
userRouter.delete('/', deleteUser);
userRouter.put('/', updateUser);

export default userRouter;