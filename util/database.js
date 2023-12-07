const Sequelize = require("sequelize");

console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USERNAME:", process.env.DB_USERNAME);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: "mysql",
  host: process.env.DB_HOST,
});

module.exports = sequelize;
