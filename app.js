import express from "express";
import { config } from "dotenv";
import paymentRoute from "./routes/paymentRouter.js"
import cors from "cors"
// var cors = require('cors')

config({ path: "./config/config.env" })

const corsOptions = {
    origin: 'http://localhost:4000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

export const app = express();
app.use(cors(corsOptions));
app.use("/api", paymentRoute)
app.get("/api/getkey", (req, res) =>
    res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);