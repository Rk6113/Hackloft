document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('requestOtpBtn').addEventListener('click', async () => {
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('http://localhost:8000/api/auth/request-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                alert('OTP sent to your email.');
            } else {
                alert('Error sending OTP.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    document.getElementById('otploginForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const otp = document.getElementById('otp').value;

        try {
            const response = await fetch('http://localhost:8000/api/auth/login-with-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, otp }),
            });

            const data = await response.json();
            console.log(data)
   
            if (response.ok) {
                localStorage.setItem('email',data.user.email)
                localStorage.setItem('token', data.token);
                localStorage.setItem('id', data.user.id);
                localStorage.setItem('points',data.user.points)
                alert('Login successful!');
                window.location.href = 'dashboard.html';
            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
