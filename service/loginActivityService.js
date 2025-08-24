import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/winstonLogger.js';
const prisma = new PrismaClient();

/**
* check if user has login activity today
* if today is present then update it
* else create one for today
*/
export const updateUserLoginActivity = async (user) =>{

    const lastLogin = await prisma.loginActivity.findMany({
        where: { userId : user.id },
        orderBy: { loginAt: "desc" },
        take: 1,
    });

    // user is logging in first time so create a row
    if(lastLogin.length == 0) {
        await prisma.loginActivity.create({
            data: {
                userId: user.id,
                loginAt: new Date(),
                firstLoginAt: new Date()
            }
        })
        return;
    }

    // user already logged in today , so update today's record
    if(isUserLoggedInToday(lastLogin[0].loginAt)) {
        await prisma.loginActivity.update({
            where: {
                id: lastLogin[0].id
            },
            data: {
                loginAt: new Date()
            }
        })
        return;
    }
    // user not logged in today , so create a row for today
    await prisma.loginActivity.create({
        data: {
            userId: user.id,
            loginAt: new Date(),
            firstLoginAt: new Date()
        }
    })
    return;
    
}

function isUserLoggedInToday (lastLogin) {
    lastLogin.setHours(0,0,0,0);
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);

    if(lastLogin.toDateString() === currentDate.toDateString()) {
        // user logged in today
        return true
    }
    return false
}