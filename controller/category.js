const Category = require("../modals/category");
const Product = require("../modals/product");
const slugify = require("slugify");
exports.create = async (req, res) => {
  const { name } = req.body;
  const data = {
    name,
    slug: slugify(name),
  };
  //   const category = await new Category({ name, slug: slugify(name) }).save();
  Category.create(data, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send("Category Failed");
    } else {
      console.log(result);
      res.status(201).send(result);
    }
  });
  console.log(category);
};
exports.read = async (req, res) => {
  const category = await Category.find({ slug: req.params.slug }).exec();
  const products = await Product.find({ category: category[0]._id }).exec();
  res.json({
    category,
    products,
  });
  console.log({ products, category });
};
exports.update = (req, res) => {
  const oldName = req.params.slug;
  const newName = req.body.name;
  console.log({ oldName, newName });
  Category.findOneAndUpdate(
    { slug: oldName },
    { name: newName, slug: slugify(newName) },
    { new: true },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        res.status(201).send("category updated succesfully");
      }
    }
  );
};
exports.remove = (req, res) => {
  Category.findOneAndRemove({ slug: req.params.slug }, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(201).send(result);
  });
};
exports.list = (req, res) => {
  Category.find((err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send("failed to fetch data");
    } else {
      console.log(result);
      res.status(200).send(result);
    }
  }).sort({ createdAt: "-1" });
};
