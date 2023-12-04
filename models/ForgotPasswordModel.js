const Sequelize = require("sequelize");
const sequelize = require("../util/database");


const forgotPasswordModel = sequelize.define("ForgotPasswordRequests",{
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    
});


module.exports = forgotPasswordModel;