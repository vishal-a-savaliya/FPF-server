import { instance } from "../server.js";
import crypto from "crypto";
import { doc, getDoc, updateDoc } from "firebase/firestore";

//*********************Fire base Configuration ********************/
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDJNMEYGUrkDn-JitCSJpqeTWbznZN6QMc",
    authDomain: "pfp-db.firebaseapp.com",
    projectId: "pfp-db",
    storageBucket: "pfp-db.appspot.com",
    messagingSenderId: "725389463966",
    appId: "1:725389463966:web:b0bc98ba77a4a5085b868f",
    measurementId: "G-R42F89SNHN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const checkout = async (req, res) => {
    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        order,
    });
};

export const payment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Database comes here

        // await Payment.create({
        //     razorpay_order_id,
        //     razorpay_payment_id,
        //     razorpay_signature,
        // });

        // update data in db
        updateDoc(doc(db, "Orders", razorpay_order_id), {
            paymentID: razorpay_payment_id,
            date: `${new Date().getDate()} / ${
                new Date().getMonth() + 1
            } / ${new Date().getFullYear()}`,
            razorpay_order_id,
            razorpay_signature,
        })
            .then(() => {
                console.log("Data added successfully.");
            })
            .catch((e) => {
                console.error(
                    "Error occured while adding data with orderId : ",
                    order.id,
                    e
                );
            });

        // fetch data from db
        try {
            const docRef = doc(db, "Orders", razorpay_order_id);
            const orderDetails = await getDoc(docRef);

            res.redirect(
                `http://localhost:3000/ordersuccess?reference=${razorpay_payment_id}&product=${
                    orderDetails.data().productName
                }&date=${orderDetails.data().date}&total=${
                    orderDetails.data().total
                }`
            );
        } catch (e) {
            console.log(
                "Error occured while feching order details with id : ",
                razorpay_order_id,
                e
            );
        }
    } else {
        res.status(400).json({
            success: false,
        });
    }
};
