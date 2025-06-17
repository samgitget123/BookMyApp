
import express from 'express';
const router = express.Router();
import { createGround , getGroundsByLocation , getGroundsByIdandDate , getUserGrounds , getuserGroundsByIdAndDate, registerUserWithGround, resetUserPassword} from '../controllers/groundsController.js';
import {upload} from '../middleware/upload.js';
router.route('/createGround').post(upload.array("photo", 5), createGround);
router.route('/').get(getGroundsByLocation);
router.route('/:ground_id').get(getGroundsByIdandDate);
router.route('/user/grounds').get(getUserGrounds);
router.route('/grounddetails').get(getuserGroundsByIdAndDate);
router.route('/cerateGroundUser').post(upload.array("photo", 5), registerUserWithGround);
router.route('/resetPassword').post(resetUserPassword);
export default router;
