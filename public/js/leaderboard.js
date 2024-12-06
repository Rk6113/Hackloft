document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('leaderboard-table').getElementsByTagName('tbody')[0];

    // Fetch leaderboard data
    fetch('http://localhost:8000/api/auth/leaderboard')
        .then(response => response.json())
        .then(users => {
            users.forEach((user, index) => {
                const row = tableBody.insertRow();
                const rankCell = row.insertCell(0);
                const nameCell = row.insertCell(1);
                const pointsCell = row.insertCell(2);
                const challengeCell = row.insertCell(3);

                rankCell.textContent = index + 1;
                nameCell.textContent = user.name;
                pointsCell.textContent = user.points;

                // Create a challenge button for each user
                const challengeButton = document.createElement('button');
                challengeButton.textContent = 'Challenge';
                challengeButton.onclick = () => showChallengeModal(user._id, user.name);
                challengeCell.appendChild(challengeButton);
            });
        })
        .catch(error => console.error('Error loading the leaderboard:', error));

    // Fetch problems for the dropdown
    fetch('http://localhost:8000/api/problems')
        .then(response => response.json())
        .then(problems => {
            window.problems = problems; // Store problems globally to use later
            const problemSelect = document.getElementById('problemSelect');
            problems.forEach(problem => {
                let option = new Option(problem.title, problem._id);
                problemSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error loading problems:', error));
});

function showChallengeModal(challengeeId, challengeeName) {
    const modal = document.getElementById('challengeModal');
    const challengeHeader = document.getElementById('challengeHeader');
    challengeHeader.textContent = `Challenge ${challengeeName}`;
    modal.style.display = 'block';

    const submitButton = document.getElementById('submitChallenge');
    submitButton.onclick = () => sendChallenge(challengeeId);
}

function sendChallenge(challengeeId) {
    const challengerId = localStorage.getItem('id'); // Assume you store user ID in localStorage
    const problemId = document.getElementById('problemSelect').value;

    fetch('http://localhost:8000/api/challenge/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ challengerId, challengeeId, problemId })
    })
    .then(response => {
        if (response.ok) {
            alert('Challenge sent successfully!');
            document.getElementById('challengeModal').style.display = 'none';
        } else {
            response.json().then(data => alert(data.message));
        }
    })
    .catch(error => {
        console.error('Error sending challenge:', error);
        alert('Failed to send challenge. Please try again later.');
    });
}

