document.addEventListener('DOMContentLoaded', function() {
    const userId = localStorage.getItem('id'); // Assume user ID is stored in localStorage

    // Fetch received challenges
    fetch(`http://localhost:8000/api/challenge/${userId}`)
        .then(response => response.json())
        .then(challenges => {
            const container = document.getElementById('challenges-container');
            populateChallenges(challenges, container, true);
        })
        .catch(error => console.error('Error loading received challenges:', error));

    // Fetch sent challenges
    fetch(`http://localhost:8000/api/challenge/c/${userId}`)
        .then(response => response.json())
        .then(challenges => {
            const container = document.getElementById('challenges-container-for-challenger');
            populateChallenges(challenges, container, false);
        })
        .catch(error => console.error('Error loading sent challenges:', error));
});
function populateChallenges(challenges, container, isReceived) {
    if (challenges.length === 0) {
        container.innerHTML = '<p>No challenges found.</p>';
    } else {
        challenges.forEach(challenge => {
            const div = document.createElement('div');
            div.className = 'challenge-item';
            div.innerHTML = `
                <strong>From:</strong> ${challenge.challengerId.name}<br>
                <strong>To:</strong> ${challenge.challengeeId.name}<br>
                <strong>Problem:</strong> ${challenge.problemId.title}<br>
                <strong>Status:</strong> ${challenge.status}<br>
            `;

            if (isReceived && challenge.status === 'pending') {
                div.innerHTML += `
                    <button id="accept-${challenge._id}">Accept Challenge</button>
                    <button id="solve-${challenge._id}" style="display: none;">Solve Challenge</button>
                `;
            } else if (!isReceived && challenge.status == 'accepted') {
                div.innerHTML += `<button onclick="window.location.href = 'compiler.html?problemId=${challenge.problemId._id}&source=challenger&challengeId=${challenge._id}'">View Problem</button>`;
            }
            else if (challenge.status=='accepted'){
                div.innerHTML += `<button onclick="window.location.href = 'compiler.html?problemId=${challenge.problemId._id}&source=challenger&challengeId=${challenge._id}'">View Problem</button>`;

            }

            container.appendChild(div);
            if (isReceived) { // Ensure this is called after the div is appended to container
                addChallengeEventListeners(challenge, isReceived);
            }
        });
    }
}


function addChallengeEventListeners(challenge, isReceived) {
    const acceptBtn = document.getElementById(`accept-${challenge._id}`);
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            fetch(`http://localhost:8000/api/challenge/${challenge._id}/accept`, {
                method: 'PUT'
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                document.getElementById(`solve-${challenge._id}`).style.display = 'block';
                this.style.display = 'none';
            })
            .catch(error => {
                console.error('Error accepting challenge:', error);
                alert('Failed to accept challenge.');
            });
        });
    }

    if (isReceived) {
        const solveBtn = document.getElementById(`solve-${challenge._id}`);
        if (solveBtn) {
            solveBtn.addEventListener('click', () => {
                window.location.href = `compiler.html?problemId=${challenge.problemId._id}`;
            });
        }
    }
}
