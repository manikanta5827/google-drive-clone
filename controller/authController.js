import { logger } from '../utils/winstonLogger.js';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const saltRounds = 10;
const EMAIL_VERIFICATION_SECRET_CODE = process.env.EMAIL_VERIFICATION_SECRET_CODE;
const EMAIL_VERIFICATION_EXPIRATION_TIME = 1000 * 60 * 10 // 10 MINS

export const register = async (req,res) => {
    let username = req.get('username');
    let email = req.get('email');
    let password = req.get('password');

    // validate the request body
    if(!username) {
        return res.status(400).json({
            status: "error",
            message: "Username is required",
        });
    }

    if(!email) {
        return res.status(400).json({
            status: "error",
            message: "Email is required",
        });
    }

    if(!password) {
        return res.status(400).json({
            status: "error",
            message: "Password is required",
        });
    }

    // check if the user already exists
    const existingEmail = await prisma.user.findUnique({
        where:{
            email,
        }
    })

    const existingUsername = await prisma.user.findUnique({
        where: {
            username
        }
    })

    if(existingUsername) {
        return res.status(400).json({
            status: "error",
            message: "Username already exists",
        });
    }

    if(existingEmail) {
        return res.status(400).json({
            status: "error",
            message: "Email already exists",
        });
    }

    // validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid email format",
        });
    }

    // validate the password
    if(password.length < 8) {
        return res.status(400).json({
            status: "error",
            message: "Password must be at least 8 characters long",
        });
    }

    // validate if password contains at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!passwordRegex.test(password)) {
        return res.status(400).json({
            status: "error",
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        });
    }

    // validates the username
    if(username.length < 3) {
        return res.status(400).json({
            status: "error",
            message: "Username must be at least 3 characters long",
        });
    }

    if(username.length > 20) {
        return res.status(400).json({
            status: "error",
            message: "Username must be less than 20 characters long",
        });
    }
    // validate username should only contains letters
    const usernameRegex = /^[a-zA-Z]+$/;
    if(!usernameRegex.test(username)) {
        return res.status(400).json({
            status: "error",
            message: "Username should only contains letters",
        });
    }
    
    // hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //create the user
    await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });

    // send a verification mail to the user
    let expirationTime = Date.now() + EMAIL_VERIFICATION_EXPIRATION_TIME;
    let combinedSecret = `${EMAIL_VERIFICATION_SECRET_CODE}-${email}-${expirationTime}`;
    let code = await bcrypt.hash(combinedSecret, saltRounds);

    // TODO send mail to user for now log it
    logger.info(`Email verification send to user::${email} link::http://localhost:3400/user/verify?code=${code}&email=${email}&expiration_time=${expirationTime}`);

    return res.status(201).json({
        status: "success",
        message: "User created successfully"
    });
}

export const verifyEmail = async (req, res) => {
    let code = req.get('code');
    let email = req.get('email');
    let expirationTime = req.get('expiration_time');

    // validate the request body
    if(!code) {
        return res.status(400).json({
            status: "error",
            message: "Code is required",
        });
    }

    if(!email) {
        return res.status(400).json({
            status: "error",
            message: "email is required"
        })
    }

    if(!expirationTime) {
        return res.status(400).json({
            status: "error",
            message: "missing expiration time"
        })
    }

    let combinedSecret = `${EMAIL_VERIFICATION_SECRET_CODE}-${email}-${expirationTime}`;
    let isSame = bcrypt.compare(combinedSecret, code);

    if(!isSame) {
        return res.status(400).json({
            status: "error",
            message: "Invalid code",
        });
    }

    console.log(Date.now());
    // check if link is expired
    if(Date.now() > expirationTime) {
        return res.status(400).json({
            status: "error",
            message: "link expired"
        })
    }

    // update the user emailVerified to true
    await prisma.user.update({
        where: { email },
        data: {
            emailVerified: true
        }
    });

    return res.status(200).json({
        status: "success",
        message: "Email verification successful"
    })
}