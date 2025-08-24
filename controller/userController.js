import {logger} from '../utils/winstonLogger.js';
import { PrismaClient } from '@prisma/client';
import { formatUserResponse } from '../service/userService.js';

const prisma = new PrismaClient();

export const getProfile = async (req,res) => {
    const username = req.get('username');

    if(!username){
        return res.status(400).json({
            status: "error",
            message: "username is required"
        })
    }

    const user = await prisma.user.findUnique({
        where:{
            username: username
        }
    })

    if(!user) {
        return res.status(404).json({
            status: "error",
            message: "user not found"
        })
    }
    const formattedData = formatUserResponse(user);
    res.status(200).json(formattedData)
} 