const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const https = require("https");

const userRouter = require("./routes/userRouter");
const sequelize = require("./util/database");
const incomeRouter = require("./routes/incomeRouter");
const expenseRotuer = require("./routes/expenseRouter");
const forgotPassRouter = require("./routes/forgotPasswordRouter");

const Expense = require("./models/expenseModel");
const Income = require("./models/incomeModel");
const User = require("./models/userModel");
const Order = require("./models/ordersModel");
const forgotPasswordModel = require("./models/ForgotPasswordModel");
const downloadLinks = require("./models/downloadLinkModel");

const userauthentication = require("./middleware/authentication");
const purchaseMembershipRouter = require("./routes/purchaseMembershipRouter");
const premiumFeatureRouter = require("./routes/premiumFeatureRouter");

const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");



const cors = require("cors");
const app = express();
console.log("Environment Variables:", process.env.DB_HOST);

const port = process.env.PORT;


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
app.use("/forgotPassword", forgotPassRouter);

// const accessLogStream= fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(helmet());
app.use(compression());
// app.use(morgan("combined", {stream:accessLogStream}));

User.hasMany(Income);
Income.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(forgotPasswordModel);
forgotPasswordModel.belongsTo(User);

User.hasMany(downloadLinks);
downloadLinks.belongsTo(User);

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cer');

// console.log("Environment Variables:", process.env);
// console.log("Database Connection Configuration:", sequelize.config);

console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully.");
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });



