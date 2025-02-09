import express from "express";
import { createpayment, verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post('/create-order', createpayment);
router.post('/verify-payment', verifyPayment);

export default router;
