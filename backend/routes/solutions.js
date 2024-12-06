// routes/solutions.js
const express = require('express');
const { exec } = require('child_process');
const Problem = require('../models/Problem');
const router = express.Router();

// @route POST /api/solutions/:id
// @desc Validate solution for a specific problem
router.post('/:id', async (req, res) => {
    const { code } = req.body;
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({ msg: 'Problem not found' });
        }

        // Iterate over each test case and validate
        for (const testCase of problem.testCases) {
            // Save user code to a temporary file (e.g., solution.js)
            const solutionFile = `temp/solution.js`; // Ensure you handle file paths securely
            const fs = require('fs');
            fs.writeFileSync(solutionFile, `${code}\nconsole.log(${testCase.input});`);

            // Execute the solution file and capture the output
            const command = `node ${solutionFile}`;
            const output = await new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        reject(stderr);
                    } else {
                        resolve(stdout.trim());
                    }
                });
            });

            // Compare the output with the expected result
            if (output !== testCase.output) {
                return res.status(400).json({ message: `Test case failed: Input: ${testCase.input}, Expected: ${testCase.output}, Got: ${output}` });
            }
        }

        res.json({ message: 'All test cases passed!' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
