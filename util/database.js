const Sequelize = require("sequelize");



const sequelize = new Sequelize('ExpenseTracker', 'admin', 'Aman8624$', {
  
  dialect: "mysql",
  host: 'database-2.cxmtgoj1no82.us-east-1.rds.amazonaws.com',
},);

module.exports = sequelize;


// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("expense", "root", "root", {
//   dialect: "mysql",
//   host: "localhost",
// });

// module.exports = sequelize;
