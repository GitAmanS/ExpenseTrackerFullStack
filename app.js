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
app.use("/forgotPassword", forgotPassRouter);

const accessLogStream= fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
app.use(helmet());
app.use(compression());
app.use(morgan("combined", {stream:accessLogStream}));

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

sequelize
  .sync()
  .then(() => {
    // https
    //   .createServer({key:privateKey, cert: certificate}, app)
    //   .listen(process.env.PORT||3000);
    app.listen(process.env.PORT||3000);
  })
  .catch((err) => {
    console.error(err);
  });


