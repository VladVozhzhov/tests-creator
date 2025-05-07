const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router
    .get('/', testController.handleGetAllTests)
    .get('/my-tests', testController.handleGetUserTests)
    .get('/user/:userId', testController.handleGetUserTests)
    .get('/:id', testController.handleGetTest)
    .get('/:id/status', testController.handleTestStatus)
    .get('/:id/results', testController.handleTestResults)
    .post('/', testController.handleCreateTest)
    .post('/:id/submit', testController.handleSubmitTest)
    .post('/:id/like', testController.handleLikeTest);

module.exports = router;