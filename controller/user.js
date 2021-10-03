const User = require("../modals/user");
const Product = require("../modals/product");
const Cart = require("../modals/cart");
const Order = require("../modals/order");
const Coupon = require("../modals/coupon");

exports.saveCartInfo = async (req, res) => {
  const { cart } = req.body;

  let products = [];

  const user = await User.findOne({ email: req.user.email }).exec();

  let cartExistByUser = await Cart.findOne({ orderdBy: user._id }).exec();
  if (cartExistByUser) {
    cartExistByUser.remove();
    console.log("cart removed");
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;

    let { price } = await Product.findById(cart[i]._id).select("price").exec();
    object.price = price;
    products.push(object);
  }

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  console.log(cartTotal);

  let newCart = await new Cart({
    products,
    cartTotal,
    orderdBy: user._id,
  }).save();

  console.log("new cart", newCart);
  res.status(201).json({ ok: true });
};

exports.getCartInfo = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).exec();
    let cart = await Cart.findOne({ orderdBy: user._id })
      .populate("products.product")
      .exec();
    console.log(cart);
    res.json({
      products: cart?.products,
      cartTotal: cart?.cartTotal,
      totalAfterDiscount: cart?.totalAfterDiscount,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.emptyCartInfo = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const cart = await Cart.findOneAndRemove({ orderdBy: user._id }).exec();
  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address },
    { new: true }
  ).exec();
  res.json(userAddress);
};

exports.applyCoupon = async (req, res) => {
  try {
    const { coupon } = req.body;
    console.log("Coupon", coupon);

    const validCoupon = await Coupon.findOne({
      name: coupon,
      applied: false,
    }).exec();
    console.log(validCoupon);
    if (validCoupon == null) {
      return res.status(400).json({
        err: "Invalid Coupon Code",
      });
    }
    const user = await User.findOne({ email: req.user.email }).exec();

    let cartInfo = await Cart.findOne({ orderdBy: user._id }).exec();
    console.log(cartInfo);
    let { cartTotal } = cartInfo;

    //calculate the discounted amount
    let totalAfterDiscount = (
      cartTotal -
      (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);
    console.log(totalAfterDiscount);

    await Cart.findOneAndUpdate(
      { orderdBy: user._id },
      { totalAfterDiscount },
      { new: true }
    ).exec();
    res.json({ cartTotal, totalAfterDiscount });
  } catch (err) {
    console.log(err);
  }
};

exports.createOrder = async (req, res) => {
  const { paymentIntent } = req.body.stripeResponse;
  const user = await User.findOne({ email: req.user.email }).exec();
  let { products } = await Cart.findOne({ orderdBy: user._id }).exec();

  let order = await new Order({
    paymentIntent,
    products,
    orderdBy: user._id,
  }).save();

  //decreament and increment
  let bulkOption = products?.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  let updated = await Product.bulkWrite(bulkOption, {});
  console.log({ updated });
  res.json({ ok: true });
};

exports.fetchAllUserOrders = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();
  const orders = await Order.find({ orderdBy: user._id })
    .populate("products.product")
    .exec();
  console.log(orders);
  res.json(orders);
};
