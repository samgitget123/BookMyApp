import express from 'express';
const router = express.Router();
import { loginUser, registerUser } from '../controllers/userController.js';

router.route('/loginUser').post(loginUser);
router.route('/register').post(registerUser);

export default router;