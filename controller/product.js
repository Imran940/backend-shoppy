const Product = require("../modals/product");
const User = require("../modals/user");
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
  c;
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

exports.getProductsCount = async (req, res) => {
  try {
    let productCount = await Product.find({}).estimatedDocumentCount().exec();
    res.json(productCount);
  } catch (err) {
    console.log(err);
  }
};

exports.list = async (req, res) => {
  try {
    // createdAt, asc desc, count
    const { sort, order, page } = req.body;
    const currentPage = page || 1; //page-2
    const perPage = 3;
    const product = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();
    res.status(200).send(product);
  } catch (err) {
    console.log(err);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .populate("postedBy") // wants to send particular property .populate("postedBy","_id name")
    .exec();

  res.status(200).send(related);
};
exports.updateRating = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;

  //who is updating..
  //check if currently logged in user has given the rating for this product before
  let existingRatingObj = product.ratings.find(
    (elem) => elem.postedBy.toString() == user._id.toString()
  );
  if (existingRatingObj === undefined) {
    //user giving the rating for this product at first time
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: { ratings: { star, postedBy: user._id } },
      },
      { new: true }
    ).exec();
    console.log(ratingAdded);
    res.json(ratingAdded);
  } else {
    //user has given the rating already for this product
    let ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObj },
      },
      {
        $set: { "ratings.$.star": star },
      },
      { new: true }
    );
    console.log(ratingUpdated);
    res.json(ratingUpdated);
  }
};

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("selectedSubs", "_id name")
    .populate("postedBy", "_id name")
    .exec();
  res.json(products);
};

const handlePriceQuery = async (req, res, price) => {
  try {
    const products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("selectedSubs", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log("priceQueryError", err);
  }
};

const handleQuerySubs = async (req, res, subs) => {
  const products = await Product.find({ selectedSubs: subs })
    .populate("category", "_id name")
    .populate("selectedSubs", "_id name")
    .populate("postedBy", "_id name")
    .exec();
  res.json(products);
};
//ceil and floor ->floor(2.45)->2 and ceil(2.45)->3
const handleStarRating = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: { $avg: "$ratings.star" },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((err, result) => {
      if (err) console.log(err);
      console.log(result);
      Product.find({ _id: result })
        .populate("category", "_id name")
        .populate("selectedSubs", "_id name")
        .populate("postedBy", "_id name")
        .exec((err, products) => {
          if (err) {
            console.log(err);
            res.status(500).send(err.message);
          }
          res.json(products);
        });
    });
};

const handleQueryFilter = async (req, res, fieldName, fieldValue) => {
  try {
    console.log({ fieldName, fieldValue });
    const products = await Product.find({ [fieldName]: fieldValue })
      .populate("category", "_id name")
      .populate("selectedSubs", "_id name")
      .populate("postedBy", "_id name")
      .exec();
    res.json(products);
  } catch (err) {
    console.log("CategoryError", err);
  }
};
exports.searchAndFilterProducts = async (req, res) => {
  const { query, price, category, stars, color, brand, subs, shipping } =
    req.body;
  if (query) {
    console.log("query", query);
    await handleQuery(req, res, query);
  }
  if (price) {
    console.log(price);
    await handlePriceQuery(req, res, price);
  }
  if (category) {
    console.log(category);
    await handleQueryFilter(req, res, "category", category);
  }
  if (subs) {
    console.log(subs);
    await handleQuerySubs(req, res, subs);
  }
  if (color) {
    await handleQueryFilter(req, res, "color", color);
  }
  if (brand) {
    await handleQueryFilter(req, res, "brand", brand);
  }
  if (shipping) {
    await handleQueryFilter(req, res, "shipping", shipping);
  }
  if (stars) {
    console.log(stars);
    await handleStarRating(req, res, stars);
  }
};
