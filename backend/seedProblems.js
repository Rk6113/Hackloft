const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Problem = require('./models/Problem');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);


const seedProblems = async () => {
  const problems = [
    {
        title: "Hello World Program",
        description: "Write a Python program that prints 'Hello, World!'.",
        sampleInput: "N/A",  // Updated to a non-empty string
        sampleOutput: "Hello, World!",
        difficulty: "Easy",  // Changed from 'Beginner' to 'Easy'
        tags: ["Basics", "Python"],
        solution: `# Simple program to print 'Hello, World!'
print('Hello, World!')`
    },
    {
        title: "Palindrome Checker",
        description: "Check if a given string is a palindrome (reads the same forwards and backwards).",
        sampleInput: "madam",
        sampleOutput: "True",
        difficulty: "Easy",
        tags: ["String", "Python"],
        solution: `def is_palindrome(s):
    return s == s[::-1]

# Example use
print(is_palindrome('madam'))  # Expected output: True`
    },
    {
        title: "Linear Regression Numerical Problem",
        description: "Implement a linear regression model to fit given data points and predict outcomes.",
        sampleInput: "X = [1, 2, 3, 4], Y = [2.1, 4.3, 6.2, 8.5]",
        sampleOutput: "Predicted Y for input [5] should be ~10.7",
        difficulty: "Easy",
        tags: ["Regression", "ML"],
        solution: `import numpy as np
from sklearn.linear_model import LinearRegression

# Sample data
X = np.array([1, 2, 3, 4]).reshape(-1, 1)
y = np.array([2.1, 4.3, 6.2, 8.5])

# Train linear regression model
model = LinearRegression().fit(X, y)

# Predict
prediction = model.predict(np.array([[5]]))
print('Prediction for input [5]:', prediction[0])`
    },
    {
        title: "K-Means Clustering for Numerical Data",
        description: "Apply k-means clustering on a numerical dataset and output the centroids.",
        sampleInput: "Dataset = [[1.5, 2.5], [2.1, 3.4], [5.8, 6.1], [8.7, 8.9]]",
        sampleOutput: "Centroids for the clusters",
        difficulty: "Medium",
        tags: ["Clustering", "ML"],
        solution: `from sklearn.cluster import KMeans
import numpy as np

# Sample dataset
X = np.array([[1.5, 2.5], [2.1, 3.4], [5.8, 6.1], [8.7, 8.9]])

# Implement k-means clustering with 2 clusters
kmeans = KMeans(n_clusters=2, random_state=42).fit(X)

# Output centroids
print('Centroids:', kmeans.cluster_centers_)
print('Labels:', kmeans.labels_)`
    },
    {
        title: "Decision Tree Classifier with Numerical Data",
        description: "Create a decision tree classifier to predict outcomes based on numerical features.",
        sampleInput: "Features = [[1, 2], [2, 3], [3, 4], [4, 5]], Labels = [0, 1, 0, 1]",
        sampleOutput: "Predictions and tree visualization",
        difficulty: "Medium",
        tags: ["Classification", "ML"],
        solution: `from sklearn import tree
import numpy as np

# Sample dataset
X = np.array([[1, 2], [2, 3], [3, 4], [4, 5]])
y = np.array([0, 1, 0, 1])

# Train decision tree classifier
clf = tree.DecisionTreeClassifier()
clf = clf.fit(X, y)

# Print prediction for a new data point
print('Prediction for [2, 2]:', clf.predict([[2, 2]]))

# Visualize tree (requires matplotlib)
import matplotlib.pyplot as plt
plt.figure(figsize=(12, 8))
tree.plot_tree(clf, filled=True)
plt.show()`
    }
];



    try {
        await Problem.insertMany(problems);
        console.log("ML problems added successfully");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error seeding problems:", error);
        mongoose.connection.close();
    }
};

seedProblems();
