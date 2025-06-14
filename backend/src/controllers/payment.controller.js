import Razorpay from 'razorpay';
import crypto from 'crypto';
export const createRazorpayOrder = async (req, res) => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || !receipt) {
        return res.status(400).json({ error: "Amount and receipt are required" });
    }

    try {
        const options = {
            amount: Math.round(amount * 100),
            currency,
            receipt,
            payment_capture: 1, // Auto capture payment
        };

        const order = await razorpay.orders.create(options);
        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return res.status(500).json({ error: error.message });
    }
}
export const verifyRazorpayPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  const generated_signature = crypto
    .createHmac('sha256', key_secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    // Payment is verified
    return res.status(200).json({ success: true, message: "Payment verified" });
  } else {
    // Verification failed
    return res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};