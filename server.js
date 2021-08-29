const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { readdirSync } = require("fs");
require("dotenv").config();
const admin = require("./firebase");
//app begin
const app = express();
const port = process.env.PORT;
// db config
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log("connection success"))
  .catch((err) => console.log(err));

//app middlewares
app.use(cors());
app.use(morgan());
app.use(bodyParser.json({ limit: "2mb" }));
app.use(
  "/api",
  readdirSync("./routes").map((r) => require("./routes/" + r))
);
//app routes

//app listen
app.listen(port, () => console.log(`server running on port ${port}`));
