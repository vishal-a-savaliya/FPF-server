import express from "express";
import { checkout, payment } from "../controllers/paymentControler.js";

const router = express.Router();

router.route("/checkout").post(checkout);
router.route("/paymentverification").post(payment);

export default router;