async function submitResetPassword(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log('Function started');
    const url = window.location.href;
    const urlParts = url.split('/');
    const requestId = urlParts[urlParts.length - 1];
    console.log('Request ID:', requestId);

    // Get values from the form
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Perform validation (you can add more validation as needed)
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    try {
        const response = await axios.post(`/forgotPassword/updatePassword/${requestId}`, {
            password: confirmPassword,
        });

        console.log(response.data);  // Use response.data to access the response body

        // Handle success, redirect, or display a message to the user
    } catch (err) {
        console.error(err);
        // Handle errors, display an error message to the user, etc.
    }

    return false; // Ensure the form doesn't submit
}

document.getElementById('resetPasswordForm').addEventListener('submit', submitResetPassword);
