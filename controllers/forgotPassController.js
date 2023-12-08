const SibApiV3Sdk = require('sib-api-v3-sdk');
const path = require('path');

const forgotPasswordModel = require('../models/ForgotPasswordModel');
const userModel = require('../models/userModel');
const uuid = require("uuid");
const sequelize = require("../util/database");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const forgotPassword = async (req, res) => {
    // Initialize the Sendinblue API client
    console.log("this is api", process.env.API_KEY);
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;
    const email = req.body.email;
    console.log('API_KEY:', process.env.API_KEY);
    //finding user id using email id
    const user = await userModel.findOne({ where: { email: email } });

    if (!user) {
        // If the user is not found, handle accordingly
        return res.status(404).json({ error: 'User not found for the given email' });
    }

    const t = await sequelize.transaction();

    try {
        // Generate a UUID for the request
        const requestId = uuid.v4();

        // Create a new forgot password request
        await forgotPasswordModel.create({
            id: requestId,
            UserId: user.id,
            isActive: true,
        }, { transaction: t });

        // Send email with reset URL
        try {
            const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
            if (!email) {
                throw new Error("Missing recipient email in the request body");
            }

            const resetPasswordLink = `http://localhost:3000/forgotPassword/resetPassword/${requestId}`;

            const emailContent = {
                subject: 'Reset Password Link',
                htmlContent: `<p><a href="${resetPasswordLink}">Click here to reset the password.</a></p>`,
            };

            const sender = { name: 'Aman Shaikh', email: 'amanshaikh8624@gmail.com' };
            const recipients = [{ email: email }];

            const emailMessage = {
                sender,
                to: recipients,
                ...emailContent,
            };

            // Use await to ensure the asynchronous operation completes before moving on
            await apiInstance.sendTransacEmail(emailMessage);

            res.status(200).json({ message: "Forgot password request created successfully. Email sent to", email });
            await t.commit();
        } catch (error) {
            console.error('Error sending email:', error.message);
            res.status(500).json({ error: "An error occurred while sending email "+error });
            await t.rollback();
        }

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



const resetPassword = async (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '../', 'public', 'views', 'resetPasswordform.html'));
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const updatePassword = async (req, res) => {
    const requestId = req.params.id;
    const password = req.body.password;

    try {
        if (!requestId || !password) {
            return res.status(400).json({ error: 'Bad Request: requestId and password are required' });
        }

        // Find the forgot password request
        const passModel = await forgotPasswordModel.findOne({ where: { id: requestId } });

        if (!passModel) {
            return res.status(404).json({ error: 'Forgot password request not found' });
        }

        const userId = passModel.UserId;

        // Find the user by userId
        const user = await userModel.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Hash the new password
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            // Update the user's password with the hashed password
            user.password = hash;

            // Save the changes to the database
            await user.save();

            // Deactivate the forgot password request
            passModel.isActive = false;
            await passModel.save();

            res.status(200).json({ message: 'Password updated successfully' });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};



module.exports = { forgotPassword, resetPassword, updatePassword };
