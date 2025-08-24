import express from "express";
import * as userController from '../controller/userController.js';
import * as authController from "../controller/authController.js";
const router = express.Router();

// auth routes
router.post('/user/register', authController.register);
router.post('/user/verify', authController.verifyEmail);

// user routes
router.get('/user/profile', userController.getProfile);


export default router;