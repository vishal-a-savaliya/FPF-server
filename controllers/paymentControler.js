import { instance } from "../server.js";

export const checkout = async (req, res) => {
    const options = {
        amount: 5000,
        currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
        success: true,
        order,
    });

}; 