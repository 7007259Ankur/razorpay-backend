import { instance } from "../server.js";
import crypto from "crypto";
import { Payment } from "../models/paymentModel.js";


export const checkout = async (req, res) => {
  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("❌ Checkout Error:", error);
    res.status(500).json({ success: false, message: "Checkout Failed" });
  }
};

export const paymentVerification = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      res.redirect(`https://voluble-strudel-67099c.netlify.app/paymentsuccess?reference=${razorpay_payment_id}`);

    } else {
      res.status(400).json({
        success: false,
        message: "Payment Signature Verification Failed",
      });
    }
  } catch (error) {
    console.error("❌ Payment Verification Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
