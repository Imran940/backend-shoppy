const Coupon = require("../modals/coupon");
exports.create = async (req, res) => {
  try {
    const { name, expiry, discount } = req.body;
    res.json(await new Coupon({ name, expiry, discount }).save());
  } catch (err) {
    console.log(console.log(err));
  }
};

exports.remove = async (req, res) => {
  try {
    res.json(
      await Coupon.findOneAndDelete({ name: req.params.couponName }).exec()
    );
  } catch (err) {
    console.log(err);
  }
};
exports.list = (req, res) => {
  Coupon.find((err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send("failed to fetch data");
    } else {
      console.log(result);
      res.status(200).send(result);
    }
  }).sort({ createdAt: "-1" });
};
