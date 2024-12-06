const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const problemRoutes = require('./routes/problemRoutes'); // Import the problem routes
const executeRoutes = require('./routes/execute'); // Import the code execution routes
const challengesRoutes=require('./routes/challenge')
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  });
app.use(express.static('public'));
// Adjust the path to point to the parent directory of `ml-practice-platform-backend`
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/problems', problemRoutes); // Add the problem routes
app.use('/api/execute', executeRoutes); // Add the code execution routes
app.use('/api/challenge',challengesRoutes)
// Example route to serve the main index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'index.html'));
});
// Serve HTML pages directly if needed
app.get('/compiler', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public', 'compiler.html'));
});

app.get('/problems', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public', 'problems.html'));
});

// Serve other static pages as needed (e.g., dashboard, profile)
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '..','public', 'dashboard.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'profile.html'));
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
