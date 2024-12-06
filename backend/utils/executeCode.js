const { exec } = require('child_process');

function executeUserCode(code, customInput = '') {
    return new Promise((resolve, reject) => {
        try {
            const fullCode = `input_data = """${customInput}"""\n` + code;
            exec(`python -c "${fullCode.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
                if (error || stderr) {
                    return reject(stderr || error.message);
                }
                resolve(stdout);
            });
        } catch (error) {
            console.error('Execution error:', error);
            reject('Execution failed');
        }
    });
}
module.exports = (code, problemId) => {
    return new Promise((resolve, reject) => {
        exec(`python3 -c "${code}"`, (error, stdout, stderr) => {
            if (error) {
                console.error('Execution error:', stderr);
                return reject(stderr);
            }
            resolve(stdout);
        });
    });
};
module.exports = { executeUserCode };
