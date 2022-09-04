import express from 'express';
import { Login, register, verifyEmail } from '../controller/user.js';
const router = express.Router();


router.post('/login', Login);
router.post('/verifyemail', verifyEmail);
router.post('/register', register);
export default router;