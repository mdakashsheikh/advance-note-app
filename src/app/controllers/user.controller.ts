import express, { Request, Response } from 'express';
import { User } from '../models/user.model';
import z, { email } from 'zod';
import bcrypt from "bcryptjs";

export const userRoutes = express.Router();

const CreateUserZodSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    age: z.number(),
    email: z.string(),
    password: z.string(),
    role: z.string()
})

userRoutes.post('/create-user', async(req: Request, res: Response) => {

    try {
        // const zodBody = await CreateUserZodSchema.parseAsync(req.body)
        const body = req.body;

        // console.log( body, 'Zod body')

        // const user = await User.create(body);
        const user = new User(body);

        user.hashPassword(body.password)

        await user.save()
    
        res.status(201).json({
            success: true,
            message: 'User Created Successfully',
            user
        })

    } catch (error: any) {
        console.log(error)

        res.status(400).json({
            success: false,
            message: error.message,
            error
        })
    }
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