const admin = require("../firebase");
const User = require("../modals/user");
exports.checkUser = async (req, res, next) => {
  try {
    const token = req.headers.authtoken;
    const user = await admin.auth().verifyIdToken(token);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.checkAdmin = async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email }).exec();
  if (adminUser.role !== "admin") {
    res.status(401).json({
      err: "Access denied",
    });
  } else {
    next();
  }
};
