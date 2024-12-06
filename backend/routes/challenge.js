const express = require('express');
const router = express.Router();
const Challenge = require('../models/challenge');
const Problem = require('../models/Problem');

const authMiddleware = require('../middleware/authMiddleware');
//update code
router.post('/create', async (req, res) => {
    const { challengerId, challengeeId, problemId } = req.body;
  
    const newChallenge = new Challenge({
      challengerId,
      challengeeId,
      problemId
    });
  
    try {
      await newChallenge.save();
      res.status(201).send({ message: 'Challenge created successfully', challenge: newChallenge });
    } catch (error) {
      console.error('Failed to create challenge:', error);
      res.status(500).send({ message: 'Failed to create challenge due to an internal error' });
    }
  });
  // Endpoint to get all problems
router.get('/problems', async (req, res) => {
    try {
      const problems = await Problem.find({}); // Only fetch title and ID
      res.send(problems);
    } catch (error) {
      console.error('Failed to fetch problems:', error);
      res.status(500).send({ message: 'Failed to fetch problems due to an internal error' });
    }
  });

  // GET endpoint to fetch challenges for a specific user
router.get('/c/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log(userId)

  try {
    const challenges = await Challenge.find({ challengerId: userId })
      .populate('challengeeId', 'name')
       .populate('challengerId', 'name') // Assuming you want to show the challenger's name
      .populate('problemId', 'title'); // Assuming you want to show the problem's title

    res.status(200).send(challenges);
  } catch (error) {
    console.error('Failed to fetch challenges:', error);
    res.status(500).send({ message: 'Failed to fetch challenges due to an internal error' });
  }
});

  // GET endpoint to fetch challenges for a specific user
  router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const challenges = await Challenge.find({ challengeeId: userId })
        .populate('challengerId', 'name') 
        .populate('challengeeId', 'name') // Assuming you want to show the challenger's name
        .populate('problemId', 'title'); // Assuming you want to show the problem's title
  
      res.status(200).send(challenges);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      res.status(500).send({ message: 'Failed to fetch challenges due to an internal error' });
    }
  });


  // GET endpoint to fetch challenges for a specific user
  router.get('/get/:challengeId', async (req, res) => {
    const { challengeId } = req.params;
  
    try {
      const challenges = await Challenge.find({ _id: challengeId })
        .populate('challengerId', 'name') 
        .populate('challengeeId', 'name') // Assuming you want to show the challenger's name
        .populate('problemId', 'title'); // Assuming you want to show the problem's title
  
      res.status(200).send(challenges);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      res.status(500).send({ message: 'Failed to fetch challenges due to an internal error' });
    }
  });
// PUT endpoint to update the challenge status
router.put('/:challengeId/accept', async (req, res) => {
  const { challengeId } = req.params;

  try {
    const updatedChallenge = await Challenge.findByIdAndUpdate(
      challengeId,
      { status: 'accepted' },
      { new: true }
    ).populate('challengerId').populate('problemId');

    if (!updatedChallenge) {
      return res.status(404).send({ message: 'Challenge not found' });
    }

    res.status(200).send({ message: 'Challenge accepted successfully', challenge: updatedChallenge });
  } catch (error) {
    console.error('Failed to update challenge:', error);
    res.status(500).send({ message: 'Failed to update challenge due to an internal error' });
  }
});

// PUT endpoint to update the challenge status
router.put('/:challengeId/won', async (req, res) => {
  const { challengeId } = req.params;
  const { wonBy } = req.body;
  try {
    const updatedChallenge = await Challenge.findByIdAndUpdate(
      challengeId,
      { status: 'completed', wonBy:wonBy },
      // {wonBy:wonBy},
      { new: true }
    ).populate('challengerId').populate('problemId');

    if (!updatedChallenge) {
      return res.status(404).send({ message: 'Challenge not found' });
    }

    res.status(200).send({ message: 'Challenge accepted successfully', challenge: updatedChallenge });
  } catch (error) {
    console.error('Failed to update challenge:', error);
    res.status(500).send({ message: 'Failed to update challenge due to an internal error' });
  }
});

// GET endpoint to fetch accepted challenges for a specific challenger
router.get('/challenger/:challengerId/accepted', async (req, res) => {
  const { challengerId } = req.params;

  try {
    const acceptedChallenges = await Challenge.find({
      challengerId: challengerId,
      status: 'accepted'
    }).populate('challengeeId', 'name') // Assuming you want to show the challengee's name
      .populate('problemId', 'title'); // Assuming you want to show the problem's title

    if (!acceptedChallenges.length) {
      return res.status(404).send({ message: 'No accepted challenges found.' });
    }

    res.status(200).send(acceptedChallenges);
  } catch (error) {
    console.error('Failed to fetch accepted challenges:', error);
    res.status(500).send({ message: 'Failed to fetch accepted challenges due to an internal error' });
  }
});


  
  

module.exports = router;
