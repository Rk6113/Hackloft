var wonBy = ""; // Global variable to store the winner's information

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const problemId = urlParams.get('problemId');
    const challengeId = urlParams.get('challengeId');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id'); // Assume user ID is stored on login
    const email = localStorage.getItem('email');
    console.log(challengeId, "Challenge ID");

    const source = urlParams.get('source');
    console.log('Problem ID:', problemId);
    console.log('Source:', source);

    if (!token || token === 'null' || token === 'undefined') {
        alert('You must be logged in to access this page. Please log in and try again.');
        return;
    }

    // Fetch problem details from the server
    loadProblemDetails(problemId);

    document.getElementById('run-code-btn').addEventListener('click', async () => {
        if (!window.editor) {
            alert('The code editor is not fully loaded. Please refresh the page and try again.');
            return;
        }

        const userCode = window.editor.getValue().replace(/\s+/g, ' ').trim(); // Normalize user code
        const problemTitle = document.getElementById('problem-title').textContent;
        const currentProblem = problemData.find(problem => problem.title === problemTitle);

        if (currentProblem) {
            const solutionCode = currentProblem.solution.replace(/\s+/g, ' ').trim(); // Normalize solution code
            console.log('User Code:', userCode);
            console.log('Solution Code:', solutionCode);
            console.log(userCode === solutionCode)

            if (userCode === solutionCode) {
                document.getElementById('output').textContent = currentProblem.sampleOutput;
                document.getElementById('submit-btn').disabled = false; // Enable submit button
            } else {
                document.getElementById('output').textContent = 'Error: Your code does not match the expected solution. Please try again.';
            }
        } else {
            document.getElementById('output').textContent = 'Error: Problem solution not found.';
        }
    });

    document.getElementById('submit-btn').addEventListener('click', async () => {
        const difficulty = problemData.find(problem => problem.title === document.getElementById('problem-title').textContent).difficulty;
        const pointsEarned = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 20 : 40;
        const updatedPoints = parseInt(localStorage.getItem('points')) + pointsEarned;
        console.log(pointsEarned, "Points Earned");
        console.log(updatedPoints, "Updated Points");

        // Check if this challenge has already been won
        if (challengeId && source === 'challenger') {
            try {
                const challengeResponse = await fetch(`http://localhost:8000/api/challenge/get/${challengeId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const challengeData = await challengeResponse.json();
                wonBy = challengeData[0].wonBy;
                console.log(challengeData,"challenge data")
                if (challengeData[0].wonBy) {
                    alert(`This challenge has already been solved by ${challengeData[0].wonBy}.`);
        window.location.href = 'leader.html';

                    return; // Stop processing the submission
                }
            } catch (error) {
                console.error('Error fetching challenge details:', error);
                alert('An error occurred while checking challenge status. Please try again.');
                return;
            }
        }

        if (!wonBy) {
            // Update points and challenge status if not won
            try {
                const response = await fetch('http://localhost:8000/api/auth/updatePoints', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ userId, points: updatedPoints })
                });

                if (response.ok) {
                    alert('Points updated successfully!');
                    localStorage.setItem("points",updatedPoints)
                    window.location.href = 'leader.html';
                    if (challengeId) {
                        const updateChallengeResponse = await fetch(`http://localhost:8000/api/challenge/${challengeId}/won`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ wonBy: email })
                        });

                        if (!updateChallengeResponse.ok) {
                            const errorData = await updateChallengeResponse.json();
                            console.error('Failed to mark challenge as won:', errorData.message);
                            alert('Failed to update challenge status. Please try again.');
                            return;
                        }
        window.location.href = 'leader.html';

                    }
                } else {
                    const errorData = await response.json();
                    console.error('Failed to update points:', errorData.message);
                    alert('Failed to update points. Please try again.');
                }
            } catch (error) {
                console.error('Error while updating points:', error);
                alert('An error occurred while updating points. Please check your connection and try again.');
            }
        }
        console.log(wonBy, "wonBy value post submission check"); // Now, wonBy should not be undefined if the logic flows correctly
    });
});

async function loadProblemDetails(problemId) {
    try {
        const response = await fetch(`http://localhost:8000/api/problems/${problemId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const problem = await response.json();

        if (problem) {
            document.getElementById('problem-title').textContent = problem.title;
            document.getElementById('problem-description').textContent = problem.description;
            document.getElementById('problem-sample-input').textContent = problem.sampleInput;
            document.getElementById('problem-sample-output').textContent = problem.sampleOutput;
        } else {
            document.getElementById('problem-title').textContent = 'Problem not found';
        }
    } catch (error) {
        console.error('Error fetching problem details:', error);
        document.getElementById('problem-title').textContent = 'Error loading problem details';
    }
}
