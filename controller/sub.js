const Sub = require("../modals/sub");
const slugify = require("slugify");
const mongoose = require("mongoose");
exports.create = async (req, res) => {
  const { name, parent } = req.body;
  const data = {
    name,
    slug: slugify(name),
    parent,
  };
  //   const Sub = await new Sub({ name, slug: slugify(name) }).save();
  Sub.create(data, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send("Sub Failed");
    } else {
      console.log(result);
      res.status(201).send("Sub created..");
    }
  });
  console.log(Sub);
};
exports.read = (req, res) => {
  console.log(req.params.slug);
  Sub.find({ slug: req.params.slug }, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(result);
    res.status(200).send(result);
  });
};
exports.update = async (req, res) => {
  try {
    const oldName = req.params.slug;
    const { name, parent } = req.body;
    const result = await Sub.findOneAndUpdate(
      { slug: oldName },
      { name, slug: slugify(name), parent },
      { new: true }
    ).exec();
    console.log(result);
    res.status(201).send(result);
  } catch (err) {
    console.log(err);
  }
};
exports.remove = (req, res) => {
  Sub.findOneAndRemove({ slug: req.params.slug }, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).send("Sub deleted...");
  });
};
exports.list = (req, res) => {
  Sub.find((err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send("failed to fetch data");
    } else {
      console.log(result);
      res.status(200).send(result);
    }
  }).sort({ createdAt: "-1" });
};
