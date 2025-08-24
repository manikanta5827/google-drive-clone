import express from "express";
import * as userController from '../controller/userController.js';

const router = express.Router();


// user routes
router.get('/', userController.getUser);


export default router;