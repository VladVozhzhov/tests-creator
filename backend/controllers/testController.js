const Test = require('../model/Test');
const User = require('../model/User'); 

// Get a single test by ID
const handleGetTest = async (req, res) => {
  try {
    const { id } = req.params;
    
    const test = await Test.findById(id).exec();
    if (!test) return res.status(404).json({ message: 'Test not found' });

    res.json(test);
  } catch (err) {
    console.error('Error fetching test:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all tests created by a user
const handleGetUserTests = async (req, res) => {
  try {
    const userId = req.params.userId || req.user._id;
    
    const user = await User.findById(userId)
      .populate('createdTests')
      .exec();
      
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user.createdTests || []);
  } catch (err) {
    console.error('Error fetching user tests:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all tests
const handleGetAllTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .sort({ createdAt: -1 })
      .exec();
    
    res.json(tests);
  } catch (err) {
    console.error('Error fetching all tests:', err);
    res.status(500).json({ message: err.message });
  }
};


// Check if user has already submitted this test
const handleTestStatus = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).exec();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const alreadySubmitted = user.completedTests.some(
      test => test.testId.toString() === id.toString()
    );

    res.json({ alreadySubmitted });
  } catch (err) {
    console.error('Error checking test status:', err);
    res.status(500).json({ message: err.message });
  }
};

// Get test results for a user
const handleTestResults = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { id } = req.params;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).exec();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const test = await Test.findById(id).exec();
    if (!test) return res.status(404).json({ message: 'Test not found' });

    const completed = user.completedTests.find(
      t => t.testId.toString() === id.toString()
    );
    if (!completed) {
      return res.status(404).json({ message: 'No results found for this test' });
    }

    // Normalize answers keys to numbers for frontend compatibility
    let answers = completed.answers || {};
    if (answers && typeof answers === 'object') {
      answers = Object.keys(answers).reduce((acc, key) => {
        const numKey = isNaN(Number(key)) ? key : Number(key);
        acc[numKey] = answers[key];
        return acc;
      }, {});
    }

    // Ensure results is always an array
    const results = Array.isArray(completed.questionResults) ? completed.questionResults : [];

    res.json({
      test,
      results,
      answers
    });
  } catch (err) {
    console.error('Error fetching test results:', err);
    res.status(500).json({ message: err.message });
  }
}


// Create a new test
const handleCreateTest = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const username = req.user.username;
        
        const { name, questions } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const newTest = new Test({ 
            name, 
            questions, 
            author: username 
        });
        
        const savedTest = await newTest.save();
        
        if (!user.createdTests) {
            user.createdTests = [];
        }
        user.createdTests.push(savedTest._id);
        await user.save();

        res.status(201).json({ message: 'Test created', test: savedTest });
    } catch (err) {
        console.error('Error creating test:', err);
        next(err);
    }
};

// handle submitting test
const handleSubmitTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    console.log('Answers:', answers);
    const userId = req.user._id;
    
    const test = await Test.findById(id).exec();
    const user = await User.findById(userId).exec();
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!test) return res.status(404).json({ message: 'Test not found' });
    
    const alreadyCompleted = user.completedTests.some(test => 
      test.testId.toString() === id.toString()
    );
    
    if (alreadyCompleted) {
      return res.status(400).json({ 
        message: 'You have already completed this test',
        alreadySubmitted: true
      });
    }
    
    function arraysEqual(a, b) {
      if (!Array.isArray(a) || !Array.isArray(b)) return false;
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, idx) => val === sortedB[idx]);
    }
    
    let totalScore = 0;
    const questionResults = test.questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = Array.isArray(question.correctAnswer) 
        ? arraysEqual(question.correctAnswer, userAnswer)
        : question.correctAnswer === userAnswer;
      
      const pointsEarned = isCorrect ? (question.points || 1) : 0;
      totalScore += pointsEarned;
      
      return {
        questionId: question._id,
        correct: isCorrect,
        pointsEarned
      };
    });
    
    const maxScore = test.questions.reduce((sum, q) => sum + (q.points || 1), 0);
    
    // Ensure answers is an object and not undefined
    const userAnswers = answers && typeof answers === 'object' ? answers : {};

    user.completedTests.push({
      testId: id,
      score: totalScore,
      maxScore: maxScore,
      dateCompleted: new Date(),
      questionResults, // always an array
      answers: userAnswers // store answers
    });
    
    await user.save();
    
    if (test.views !== undefined) {
      test.views += 1;
    } else if (test.visits !== undefined) {
      test.visits += 1;
    }
    await test.save();
    
    res.status(200).json({ 
      message: 'Test submitted successfully', 
      score: totalScore,
      maxScore: maxScore,
      results: questionResults
    });
    
  } catch (err) {
    console.error('Error submitting test:', err);
    res.status(500).json({ message: err.message });
  }
}

// Handle liking a test
const handleLikeTest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const test = await Test.findById(id).exec();
    if (!test) return res.status(404).json({ message: 'Test not found' });

    const user = await User.findById(userId).lean().exec();
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Ensure likedTests is an array
    const likedTests = Array.isArray(user.likedTests) ? user.likedTests.map(tid => tid.toString()) : [];

    if (likedTests.includes(id.toString())) {
      return res.status(400).json({ message: 'You have already liked this test', likes: test.likes || 0, alreadyLiked: true });
    }

    // Actually update the user document (not the lean copy)
    await User.findByIdAndUpdate(userId, { $push: { likedTests: test._id } });

    test.likes = (test.likes || 0) + 1;
    await test.save();

    res.json({ likes: test.likes, alreadyLiked: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { 
    handleCreateTest, 
    handleGetTest,
    handleGetUserTests,
    handleGetAllTests,
    handleSubmitTest,
    handleTestStatus,
    handleTestResults,
    handleLikeTest,
};