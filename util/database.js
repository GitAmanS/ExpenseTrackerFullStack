const Sequelize = require("sequelize");



// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USERNAME,
//   process.env.DB_PASSWORD,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql', 
//   }
// );



// module.exports = sequelize;
const sequelize = new Sequelize('ExpenseTracker', 'admin', 'Aman8624$', {
  
  dialect: "mysql",
  host: 'database-1.cxmtgoj1no82.us-east-1.rds.amazonaws.com',
  
},);

module.exports = sequelize;


// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("expense", "root", "root", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;
