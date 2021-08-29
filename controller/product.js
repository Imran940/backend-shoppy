const Product = require("../modals/product");
const Sub = require("../modals/sub");
const slugify = require("slugify");
exports.create = async (req, res) => {
  try {
    const title = req.body.title;
    req.body.slug = slugify(title);
    const product = await new Product(req.body).save();
    console.log(product);
    res.status(201).send(product);
  } catch (err) {
    console.log(err);
  }
};

exports.getSubsCategory = (req, res) => {
  const cid = req.params.cid;
  Sub.find({ parent: cid }, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
    res.status(200).send(result);
  });
};
exports.list = (req, res) => {
  Product.find({}, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("something wents wrong");
      return;
    }
    console.log(result);
    res.status(200).send(result);
  });
};

exports.getLimitedProducts = async (req, res) => {
  try {
    const count = req.params.count;
    const result = await Product.find()
      .limit(parseInt(count))
      .sort([["createdAt", "-1"]])
      .populate("category")
      .populate("subs")
      .exec();
    console.log(result);
    res.status(200).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something wents wrong");
  }
};

exports.read = (req, res) => {
  Product.find({ slug: req.params.slug }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send("failed to fetch product");
      return;
    }
    console.log(result);
    res.status(200).send(result);
  })
    .populate("category")
    .populate("subs");
};
exports.update = (req, res) => {
  const title = req.body.title;
  req.body.slug = slugify(title);
  Product.findOneAndUpdate(
    { slug: req.params.slug },
    req.body,
    { new: true },
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(400).send("Failed to update product");
        return;
      }
      res.status(201).send(result);
    }
  );
};
exports.remove = async (req, res) => {
  try {
    const product = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.status(201).send(product);
  } catch (err) {
    console.log(err);
    res.status(400).send("Failed to delete product");
  }
};
