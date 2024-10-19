import express from "express";
import {
  capturePaymentAndFinalizeOrder,
  createOrder,
} from "../../controllers/studentController/OrderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePaymentAndFinalizeOrder);

export default router;
