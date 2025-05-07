const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

router
    .get('/', testController.handleGetAllTests)
    .get('/my-tests', testController.handleGetUserTests)
    .get('/user/:userId', testController.handleGetUserTests)
    .get('/:id', testController.handleGetTest)
    .post('/', testController.handleCreateTest)
    .post('/:id/submit', testController.handleSubmitTest);

module.exports = router;