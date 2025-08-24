import {logger} from '../utils/winstonLogger.js';
import { PrismaClient } from '@prisma/client';
import { formatUserResponse } from '../service/userService.js';
import { updateUserLoginActivity } from '../service/loginActivityService.js';

const prisma = new PrismaClient();

export const getProfile = async (req,res) => {

    const user = req.user;

    // update login tracker
    await updateUserLoginActivity(user);

    const formattedData = formatUserResponse(user);
    res.status(200).json(formattedData)
} 