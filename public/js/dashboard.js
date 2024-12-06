document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem('token');
    const points=localStorage.getItem('points')
    if (!token) {
        alert('You need to log in first.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/protected', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            document.querySelector('.dashboard-info').innerHTML = `
                <h3>Welcome, ${data.user.name}</h3>
                <p>Email: ${data.user.email}</p>
                <p> Keep going!</p>
            `;
        } else {
            alert('Error fetching dashboard information.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
