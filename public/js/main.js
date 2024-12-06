const problems = [
    {
        id: 1,
        title: "Linear Regression",
        difficulty: "Easy",
        description: "Implement a simple linear regression model."
    },
    {
        id: 2,
        title: "K-Means Clustering",
        difficulty: "Medium",
        description: "Cluster a dataset using the K-means algorithm."
    },
    {
        id: 3,
        title: "Support Vector Machines",
        difficulty: "Hard",
        description: "Classify data using an SVM model with an RBF kernel."
    }
];

// Function to display the list of problems
function displayProblems() {
    const problemList = document.getElementById('problem-list');

    problems.forEach(problem => {
        const problemItem = document.createElement('div');
        problemItem.classList.add('problem-item');
        problemItem.innerHTML = `
            <h4>${problem.title}</h4>
            <p><strong>Difficulty:</strong> ${problem.difficulty}</p>
            <p>${problem.description}</p>
            <button onclick="solveProblem(${problem.id})">Solve</button>
        `;
        problemList.appendChild(problemItem);
    });
}

// Function to handle problem solving (for future implementation)
function solveProblem(id) {
    alert(`Problem ${id} clicked!`);
}

// Execute when the page loads
window.onload = displayProblems;
