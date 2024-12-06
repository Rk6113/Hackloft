const express = require('express');
const router = express.Router();
const Problem = require('../models/Problem');
const authMiddleware = require('../middleware/authMiddleware');
//update code



// Route to get all problems
router.get('/', async (req, res) => {
    try {
        const problems = await Problem.find();
        res.json(problems);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Route to get a specific problem by ID
router.get('/:id', async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ msg: 'Problem not found' });
        }
        res.json(problem);
    } catch (error) {
        res.status(500).json({ msg: 'Server error' });
    }
});


module.exports = router;
