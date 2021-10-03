const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../modals/user");
const Cart = require("../modals/cart");
const Coupon = require("../modals/coupon");
exports.createPaymentIntent = async (req, res) => {
  try {
    //apply Coupon
    const user = await User.findOne({ email: req.user.email }).exec();
    const { cartTotal, totalAfterDiscount } = await Cart.findOne({
      orderdBy: user._id,
    }).exec();
    // recalculate the total amount
    let finalAmount = cartTotal * 100;
    if (totalAfterDiscount) {
      finalAmount = totalAfterDiscount * 100;
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "inr",
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
  }
};
