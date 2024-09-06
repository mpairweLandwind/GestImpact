import emailController  from '../controllers/emailController.mjs'
import { verifyToken } from '../utils/verifyUser.mjs';
//import jwtCheck from "../config/auth0Config.js";
import express from 'express';

const router = express.Router();

router.post('/send', verifyToken, emailController.sendEmail);

export default router