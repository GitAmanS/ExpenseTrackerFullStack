const express = require("express");
const bodyParser = require("body-parser");

const userRouter = require("./routes/userRouter");
const sequelize = require("./util/database");
const incomeRouter = require("./routes/incomeRouter");
const expenseRotuer = require("./routes/expenseRouter");

const Expense = require("./models/expenseModel");
const Income = require("./models/incomeModel");
const User = require("./models/userModel");
const Order = require("./models/ordersModel");

const userauthentication = require("./middleware/authentication");
const purchaseMembershipRouter = require("./routes/purchaseMembershipRouter");
const premiumFeatureRouter = require("./routes/premiumFeatureRouter");

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const app = express();
app.use(express.static("public"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/income", userauthentication.authenticate, incomeRouter);
app.use("/expense", userauthentication.authenticate, expenseRotuer);
app.use("/purchase", purchaseMembershipRouter);
app.use("/premium", premiumFeatureRouter);

User.hasMany(Income);
Income.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


User.hasMany(Expense);
Expense.belongsTo(User);

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });
