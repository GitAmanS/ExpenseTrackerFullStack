const SibApiV3Sdk = require('sib-api-v3-sdk');

// Initialize the Sendinblue API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = "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";

const sendEmail = async (req, res) => {
    try {
        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const email = req.body.email;

        if (!email) {
            return res.status(400).json({ error: "Missing recipient email in the request body" });
        }

        const emailContent = {
            subject: 'Hi, this is my first email',
            htmlContent: '<p>Congratulations! You successfully sent this example email via the Sendinblue API.</p>',
        };

        const sender = { name: 'Aman Shaikh', email: 'amanshaikh8624@gmail.com' };
        const recipients = [{ email: email }];

        const emailMessage = {
            sender,
            to: recipients,
            ...emailContent,
        };

        apiInstance.sendTransacEmail(emailMessage)
            .then(data => {
                console.log('Email sent successfully:', data);
                res.status(200).json({ message: "Email sent successfully to", email });
            })
            .catch(error => {
                console.error('Error sending email:', error.response ? error.response.text : error.message);
                res.status(500).json({ error: "An error occurred while sending email", details: error.response ? error.response.text : error.message });
            });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: "An unexpected error occurred while processing the request" });
    }
}

module.exports = { sendEmail };
