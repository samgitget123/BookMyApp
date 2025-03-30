import express from 'express';
const router = express.Router();
import { loginUser, registerUser, updateUserFlag , getAllUsers } from '../controllers/userController.js';

router.route('/loginUser').post(loginUser);
router.route('/register').post(registerUser);
router.route('/userFlag/:user_id').put(updateUserFlag);
router.route('/allusers').get(getAllUsers);
export default router;