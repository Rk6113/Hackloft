document.addEventListener("DOMContentLoaded", function () {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    alert("You have been logged out.");
    // Redirect to login page
    window.location.href = 'login.html';
});
