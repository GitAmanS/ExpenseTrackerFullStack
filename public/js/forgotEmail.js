const sendBtn = document.getElementById("sendButton");
// forgotEmail.js

async function sendEmail (event) {
    event.preventDefault();

    // Get the email input value directly from the event object
    const email = event.target.resetEmail.value;
    console.log(email);

    // Send a POST request to the server
    const response = await axios.post('http://54.152.126.236:3000/forgotPassword/', {
        email: email, 
    });
    console.log(response);
    alert("Email Sent Successfully");
    // .then(function (response) {
    //     // Handle the success response (optional)
    //     console.log('Password reset email sent successfully', response);
    // })
    // .catch(function (error) {
    //     // Handle the error (optional)
    //     console.error('Error sending password reset email', error);
    // });
}

