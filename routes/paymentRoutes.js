import express from "express";
import {
  checkout,
  paymentVerification,
  verifyAccessCode,  // ✅ Import the new controller
} from "../controllers/paymentController.js";

const router = express.Router();

// Existing routes
router.route("/checkout").post(checkout);
router.route("/paymentverification").post(paymentVerification);

// ✅ New route to verify access code for AI Predictor
router.route("/verify-access-code/:accessCode").get(verifyAccessCode);

export default router;
