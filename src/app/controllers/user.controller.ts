import express, { Request, Response } from 'express';
import { User } from '../models/user.model';


export const userRoutes = express.Router();

userRoutes.post('/create-user', async(req: Request, res: Response) => {

    const body = req.body;

    const user = await User.create(body);

    res.status(201).json({
        success: true,
        message: 'User Created Successfully',
        user
    })
})

userRoutes.get('/', async(req: Request, res: Response) => {
    
    const users = await User.find();

    res.status(200).json({
        success: true,
        message: 'User Get Successfully',
        users
    })
})

userRoutes.get('/:userId', async(req: Request, res: Response) => {

    const userId = req.params.userId;

    const user = await User.findById(userId);

    res.status(200).json({
        success: true,
        message: 'User Get Successfully',
        user
    })
})

userRoutes.patch('/:userId', async(req: Request, res: Response) => {

    const userId = req.params.userId;

    const userBody = req.body;

    const updatedUser = await User.findByIdAndUpdate(userId, userBody, { new: true });

    res.status(200).json({
        success: true,
        message: 'User Updated Successfully',
        updatedUser
    })
})

userRoutes.delete('/:userId', async(req: Request, res: Response) => {

    const userId = req.params.userId;

    await User.findByIdAndDelete(userId);

    res.status(200).json({
        success: true,
        message: 'User Deleted Successfully'
    })
})