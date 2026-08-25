import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser,
    updateUser,
    patchUser
} from '../controllers/user.js';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/', createUser);
userRouter.put('/:id', updateUser);
userRouter.patch('/:id', patchUser);
userRouter.delete('/:id', deleteUser);

export default userRouter;