const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const downloadLinksModel = sequelize.define("downloadLinks",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    url: {
        type: Sequelize.STRING,
        allowNull: false,
    }

});


module.exports = downloadLinksModel;