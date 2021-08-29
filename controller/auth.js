const User = require("../modals/user");
exports.creatOrUpdateUser = async (req, res) => {
  const { email } = req.user;
  const name = email.split("@")[0];
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name },
      { new: true }
    );
    if (user) {
      console.log("user updated-->", user);
      res.json(user);
    } else {
      const newUser = await new User({ name, email }).save();
      console.log("user created", newUser);
      res.json(newUser);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.currentUser = (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
    res.json(result);
  });
};
