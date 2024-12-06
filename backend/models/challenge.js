const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    wonBy: {
        type: String,
        default: ""
    },
    problemId: mongoose.Schema.Types.ObjectId,
    challengerId: mongoose.Schema.Types.ObjectId,
    challengeeId: mongoose.Schema.Types.ObjectId,
    status: {
        type: String,
        default: 'pending' //pending, accepted, completed
    },
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
