document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validate if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        // Send a POST request to the backend to create a new user
        const response = await fetch('http://localhost:8000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Signup successful! Redirecting to home page.');
            window.location.href = 'login.html'; // Redirect to home page
        } else {
            alert(data.msg || 'Signup failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }

    // Reset form
    document.getElementById("signupForm").reset();
});
