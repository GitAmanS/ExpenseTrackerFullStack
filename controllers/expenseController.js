const ExpenseModel = require("../models/expenseModel");
const UserModel = require("../models/userModel");
const sequelize = require("../util/database");
const AWS  = require("aws-sdk");
const downloadModel = require("../models/downloadLinkModel");

function uploadToAWS(data, filename) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  });

  return new Promise((resolve, reject) => {
    s3bucket.createBucket(() => {
      const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read',
      };

      s3bucket.upload(params, (err, s3response) => {
        if (err) {
          console.log("Something went wrong");
          reject(err);
        } else {
          console.log("Success", s3response);
          resolve(s3response.Location);
        }
      });
    });
  });
}

const expenseDownload = async (req, res) => {
  try {
    const expenses = await req.user.getExpenses();
    const userId = req.user.id;
    console.log(expenses);
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense${userId}${new Date()}.txt`;
    const fileURL = await uploadToAWS(stringifiedExpenses, filename);
    console.log("fileurl", fileURL);
    const data = await downloadModel.create({
      UserId:userId,
      url:fileURL,
    });
    res.status(200).json({ fileURL, data, success: true });

  } catch (error) {
    console.error("Error in expenseDownload:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

const getAllLinks = async(req, res) =>{
  try{
    userId = req.user.id;

    const expenseLinks  = await downloadModel.findAll({
      where: { userId: userId },
    });

    if(!expenseLinks){
      res.status(500).json({data:"No links are available for this user"});
    }else{
      res.status(200).json({expenseLinks});
    }
  }
  catch(error){
    res.status(500).json({success:false, error});
  }
};

//save data to database
const addExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const ExpenseAmount = req.body.ExpenseAmount;
    const ExpenseDescription = req.body.ExpenseDescription;
    const ExpenseCategory = req.body.ExpenseCategory;
    const ExpenseDate = req.body.ExpenseDate;

  


    const data = await ExpenseModel.create(
      {
        ExpenseAmount: ExpenseAmount,
        ExpenseDescription: ExpenseDescription,
        ExpenseCategory: ExpenseCategory,
        UserId: req.user.id,
        ExpenseDate: ExpenseDate,
      },
      { transaction: t }
    );

    const newTotalExpense =
      parseInt(req.user.totalExpense) + parseInt(ExpenseAmount);

    await UserModel.update(
      {
        totalExpense: newTotalExpense,
      },
      {
        where: { id: req.user.id },
        transaction: t, // Pass the transaction object here
      }
    );

    await t.commit();
    res.status(201).json({ Expense: data });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({
      error: "Failed to create a new Expense",
      message: error.message,

    });
  }
};


//delete user
const deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const ExpenseId = req.params.id; // Use ExpenseId instead of userId
    console.log(ExpenseId);
    if (!ExpenseId) {
      return res.status(400).json({
        error: "Expense ID missing",
      });
    }

    // Check if the Expense exists for the given ID
    const Expense = await ExpenseModel.findOne({
      where: {
        id: ExpenseId,
      },
      transaction: t,
    });

    if (!Expense) {
      await t.rollback();
      return res.status(404).json({
        error: "Expense not found",
      });
    }

    // Delete the Expense
    const deleteResult = await ExpenseModel.destroy({
      where: {
        id: ExpenseId,
      },
      transaction: t,
    });

    // Update total Expense of the user
    const newTotalExpense = req.user.totalExpense - Expense.ExpenseAmount;
    await req.user.update(
      { totalExpense: newTotalExpense },
      { transaction: t }
    );

    await t.commit();

    if (deleteResult === 1) {
      return res.status(200).json({
        success: "Expense deleted successfully",
      });
    } else {
      return res.status(404).json({
        error: "Expense not found",
      });
    }
  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({
      error: "Error in deleting Expense",
    });
  }
};

const getAllExpenses = async (req, res, next) => {
  try {
    // Extracting pagination parameters from query
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const perPage = parseInt(req.query.perPage) || 10; // Default to 10 items per page

    // Calculate offset based on page and perPage
    const offset = (page - 1) * perPage;

    const Expenses = await ExpenseModel.findAll({
      where: { userId: req.user.id },
      limit: perPage,
      offset: offset,
    });

    res.status(200).json(Expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
};


const getTotalExpenses = async (req, res, next) => {
  try {
    // Find the user by primary key (id)
    const user = await UserModel.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Access the totalExpense directly from the UserModel
    const totalExpense = user.totalExpense;

    res.status(200).json({ totalExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Internal Server Error',
    });
  }
};



module.exports = { addExpense, deleteExpense, getAllExpenses, getTotalExpenses, expenseDownload, getAllLinks };
