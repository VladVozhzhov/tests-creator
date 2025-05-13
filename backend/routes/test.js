const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const verifyJWT = require('../middleware/verifyJWT');

router
    .get('/', testController.handleGetAllTests)
    .get('/:id', testController.handleGetTest)
    .get('/:id/status', testController.handleTestStatus)
    .get('/:id/results', testController.handleTestResults)
    .get('/user/:userId', testController.handleGetUserTests)
    .get('/by-username/:username', testController.handleGetTestsByUsername)
    .use(verifyJWT)
    .get('/my-tests', testController.handleGetUserTests)
    .post('/', testController.handleCreateTest)
    .post('/:id/submit', testController.handleSubmitTest)
    .post('/:id/like', testController.handleLikeTest)
    .patch('/:id', testController.handleUpdateTest)
    .delete('/:id', testController.handleDeleteTest);

module.exports = router;