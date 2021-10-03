const Order = require("../modals/order");
const User = require("../modals/user");
exports.getAllOrders = async (req, res) => {
  let orders = await Order.find({})
    .sort("-createdAt")
    .populate("products.product")
    .exec();
  res.json(orders);
};
exports.orderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body;
  let updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  );
  res.json(updated);
};
